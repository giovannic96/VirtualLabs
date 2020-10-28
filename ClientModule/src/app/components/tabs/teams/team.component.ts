import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {Course} from '../../../models/course.model';
import {concatMap, filter, map, mergeMap, tap} from 'rxjs/operators';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {Team} from '../../../models/team.model';
import {Vm} from '../../../models/vm.model';
import {Student} from '../../../models/student.model';
import {StudentService} from '../../../services/student.service';
import {TeamService} from '../../../services/team.service';
import {TeamProposal, TeamProposalStatus} from '../../../models/team-proposal.model';
import {AreYouSureDialogComponent} from '../../../helpers/dialog/are-you-sure-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {EmailDialogComponent} from '../../../helpers/dialog/email-dialog.component';
import {NotificationService} from '../../../services/notification.service';
import {TeamProposalDialogComponent} from '../../../helpers/dialog/team-proposal-dialog.component';
import Utility from '../../../helpers/utility';
import {ViewTeamProposalDialogComponent} from '../../../helpers/dialog/view-team-proposal-dialog.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css', '../../../helpers/add-btn-round.css']
})
export class TeamComponent implements OnInit, OnDestroy {

  teams: {team: Team, students: Student[], vms: Vm[]}[] = [];
  private currentCourse: Observable<Course>;
  public teamList: Team[] = [];
  public myTeam: Team;

  public allProposals: TeamProposal[];
  public pendingProposals: TeamProposal[];
  public myPendingProposals: TeamProposal[];
  public myProposalsChecked: boolean;
  public hasAcceptedAProposal = false;
  public proposalResponses: Map<string, Observable<string>>;

  public teamedUpStudents: Student[];
  public notTeamedUpStudents: Student[];

  private subscriptions: Subscription;
  public utility: Utility;

  constructor(public authService: AuthService,
              private courseService: CourseService,
              private studentService: StudentService,
              private teamService: TeamService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

    this.subscriptions = new Subscription();
    this.utility = new Utility();

    this.proposalResponses = new Map<string, Observable<string>>();

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.currentCourse.pipe(
        concatMap(course => this.courseService.getAllTeams(course.name)),
        concatMap(teamList => {
          this.teamList = teamList;
          return teamList;
        }),
        tap(team => {
          this.setTeamMembersAndVms(team);
        })).subscribe());

    let proposalsCounter: number;

    this.subscriptions.add(
      this.currentCourse.pipe(
        concatMap(course => {
          return this.courseService.getAllProposals(course.name);
        }),
        concatMap(teamProposalList => {
          this.allProposals = teamProposalList;
          proposalsCounter = teamProposalList.length;
          this.pendingProposals = teamProposalList.filter(proposal => proposal.status === TeamProposalStatus.PENDING);
          this.myPendingProposals = [];
          if (!this.allProposals.length)
            this.myProposalsChecked = true;
          return teamProposalList;
        }),
        tap(proposal => {
          const memberList = this.teamService.getTeamProposalMembers(proposal.id);
          const proposalCreator = this.studentService.find(proposal.creatorId);

          forkJoin([memberList, proposalCreator]).subscribe(results => {
            // set team proposal members and vms
            proposal.members = results[0];
            proposal.creator = results[1];

            if (proposal.status === TeamProposalStatus.PENDING) {
              proposal.members.forEach(member => {
                const resp = this.studentService.checkProposalResponse(member.id, proposal.id).pipe(
                  map(response => response ? 'has accepted!' : 'is still thinking...'));
                this.proposalResponses.set([member.id, proposal.id].toString(), resp);
              });
            }

            // check if this is one of my team proposals and it is PENDING
            if (proposal.members.find(m => m.id === this.authService.getMyId())
              && proposal.status === TeamProposalStatus.PENDING) {
              this.myPendingProposals.push(proposal);
            }

            if (!--proposalsCounter)
              this.myProposalsChecked = true;
          });
        })).subscribe());

    this.retrieveStudentsInTeam();

    if (!this.authService.isProfessor()) {
      this.subscriptions.add(
        this.currentCourse
          .pipe(concatMap(course => {
            return this.studentService.checkAcceptedProposals(this.authService.getMyId(), course.name);
          })).subscribe(accepted => this.hasAcceptedAProposal = accepted));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  findTeam(studentId: string) {
    if (this.teamList)
      return this.teamList.find(team => team.members?.find(student => student.id === studentId));
  }

  async openDialog(team: Team) {

    // Prepare the message
    const message = 'This will delete the team ' + team.name + ' from this course';

    // Open a dialog and get the response as an 'await'
    const areYouSure = await this.dialog.open(AreYouSureDialogComponent, {disableClose: true, data: {
        message,
        buttonConfirmLabel: 'CONFIRM',
        buttonCancelLabel: 'CANCEL'
      }
    }).afterClosed().toPromise();

    // Check the response when dialog closes
    if (areYouSure) {
      this.deleteTeam(team);
    }
  }

  openEmailDialog(students: Student[]) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const emails = students.map(s => s.username);
    dialogConfig.data = {
      to: emails,
      subject: '',
      body: '',
    };

    const dialogRef = this.dialog.open(EmailDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) { // i.e. close button was pressed
          this.teamService.sendMessageToTeam(emails, data.subject, data.body).subscribe( () => {
            this.mySnackBar.openSnackBar('Email sent successfully', MessageType.SUCCESS, 3);
          }, () => {
            this.mySnackBar.openSnackBar('Error while sending the email. Some students may not have received the email correctly', MessageType.ERROR, 3);
          });
        }
      }
    );
  }

  async openTeamProposalDialog(notTeamedUpStudents: Student[], myId: string) {
    const course: Course = this.courseService.getSelectedCourseValue();

    const data = {
      teamName: '',
      course,
      students: notTeamedUpStudents,
      myId
    };
    const dialogRef = this.dialog.open(TeamProposalDialogComponent, {disableClose: true, data});
    const dialogResponse: any = await dialogRef.afterClosed().toPromise();

    if (!!dialogResponse) {
      if (dialogResponse.response === 'success') {
        this.teamService.getTeamProposal(dialogResponse.tpId)
          .subscribe(teamProposal => {
            teamProposal.creator = dialogResponse.students.find(s => s.id === teamProposal.creatorId);
            teamProposal.members = dialogResponse.students;
            teamProposal.expiryDate = this.utility.localDateTimeToString(teamProposal.expiryDate);
            this.pendingProposals.push(teamProposal);
            this.myPendingProposals.push(teamProposal);
            this.hasAcceptedAProposal = false;
            this.mySnackBar.openSnackBar('Team proposed successfully', MessageType.SUCCESS, 3);
          }
        );
      } else {
        this.mySnackBar.openSnackBar(dialogResponse.message, MessageType.ERROR, 5);
      }
    }
  }

  async openViewTeamProposalDialog(proposal: TeamProposal) {
    const data = {
      proposal,
    };
    const dialogRef = this.dialog.open(ViewTeamProposalDialogComponent, {autoFocus: false, disableClose: true, data});
    const dialogResponse: any = await dialogRef.afterClosed().toPromise();

    if (!!dialogResponse) {
      if (dialogResponse.confirmed)
        this.acceptTeamProposal(proposal);
      else
        this.rejectTeamProposal(proposal.id);
    }
  }

  acceptTeamProposal(tp: TeamProposal) {
    const course: Course = this.courseService.getSelectedCourseValue();

    this.notificationService.responseToProposal('accept', tp.id).subscribe(resp => {
      if (resp) {
        // empty all the other mine pending proposals
        this.myPendingProposals = [];

        // set my team (and update UI)
        this.courseService.getTeamByNameAndCourseName(tp.teamName, course.name).subscribe(team => {
          if (team != null) {
            this.setTeamMembersAndVms(team);
            this.teamList.push(team);
          }
        });
        this.retrieveStudentsInTeam();
        this.mySnackBar.openSnackBar('Team proposal accepted successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('Team proposal accept failed', MessageType.ERROR, 3);
      }
    });
  }

  rejectTeamProposal(tpId: number) {
    this.notificationService.responseToProposal('reject', tpId).subscribe(resp => {
      if (resp) {
        // remove rejected team proposal from my pending proposals
        if (this.myPendingProposals !== undefined) {
          const tpToReject = this.myPendingProposals.find(tp => tp.id === tpId);
          if (tpToReject) {
            this.myPendingProposals.splice(this.myPendingProposals.indexOf(tpToReject), 1);
            this.pendingProposals.splice(this.pendingProposals.indexOf(tpToReject), 1);
          }
        } else {
          this.myPendingProposals = [];
        }
        this.mySnackBar.openSnackBar('Team proposal rejected successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('Team proposal reject failed', MessageType.ERROR, 3);
      }
    });
  }

  checkProposalResponse(studentId: string, tpId: number): Observable<string> {
    return this.proposalResponses.get([studentId, tpId].toString());
  }

  setTeamMembersAndVms(team: Team) {
    const memberList = this.teamService.getTeamMembers(team.id);
    const vmList = this.teamService.getTeamVms(team.id);

    forkJoin([memberList, vmList]).subscribe(results => {
      // set team members and vms
      team.members = results[0];
      team.vms = results[1];

      // check if this is my team
      if (team.members.find(m => m.id === this.authService.getMyId())) {
        this.myTeam = team;
      }
    });
  }

  deleteTeam(team: Team) {
    this.teamService.deleteTeam(team.id).subscribe(() => {
      this.teamList.splice(this.teamList.indexOf(team), 1);
      team.members.forEach(member => {
        this.teamedUpStudents.splice(this.teamedUpStudents.indexOf(member), 1);
        this.notTeamedUpStudents.push(member);
      });
      this.mySnackBar.openSnackBar('Team removed successfully', MessageType.SUCCESS, 3);
    }, () => {
      this.mySnackBar.openSnackBar('Error in deleting team ' + team.name, MessageType.ERROR, 5);
    });
  }

  isInATeamProposal(studentId: string) {
    let found = false;
    this.pendingProposals?.forEach(tp => {
      found = tp.members?.some(s => s.id === studentId);
    });
    return found;
  }

  isAlreadyTeamedUp() {
    return this.teamedUpStudents?.length > 0 && this.teamedUpStudents?.find(s => s.id === this.authService.getMyId());
  }

  retrieveStudentsInTeam() {
    this.subscriptions.add(
      this.currentCourse
        .pipe(mergeMap(course => {
          return forkJoin([
            this.courseService.getTeamedUpStudents(course.name),
            this.courseService.getNotTeamedUpStudents(course.name),
          ]);
        })).subscribe(students => {
          this.teamedUpStudents = students[0];
          this.notTeamedUpStudents = students[1];
      }));
  }
}
