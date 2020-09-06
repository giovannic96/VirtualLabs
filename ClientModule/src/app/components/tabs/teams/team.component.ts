import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {Course} from '../../../models/course.model';
import {catchError, concatMap, filter, tap} from 'rxjs/operators';
import {EMPTY, forkJoin, Observable} from 'rxjs';
import {Team} from '../../../models/team.model';
import {Vm} from '../../../models/vm.model';
import {Student} from '../../../models/student.model';
import {StudentService} from '../../../services/student.service';
import {TeamService} from '../../../services/team.service';
import {TeamProposal, TeamProposalStatus} from '../../../models/team-proposal.model';
import {MyDialogComponent} from '../../../helpers/dialog/my-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {EmailDialogComponent} from '../../../helpers/dialog/email-dialog.component';
import {NotificationService} from '../../../services/notification.service';
import {TeamProposalDialogComponent} from '../../../helpers/dialog/team-proposal-dialog.component';
import Utility from '../../../helpers/utility';
import {ViewTeamProposalDialogComponent} from '../../../helpers/dialog/view-team-proposal-dialog.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css', '../../../helpers/add-btn-round.css']
})
export class TeamComponent implements OnInit {

  teams: {team: Team, students: Student[], vms: Vm[]}[] = [];
  private currentCourse: Observable<Course>;
  public teamList: Team[] = [];
  public myTeam: Team;

  public allProposals: TeamProposal[];
  public pendingProposals: TeamProposal[];
  public myPendingProposals: TeamProposal[] = [];
  public hasAcceptedAProposal = false;

  public teamedUpStudents: Student[];
  public notTeamedUpStudents: Student[];

  public utility: Utility;

  constructor(private courseService: CourseService,
              private studentService: StudentService,
              private teamService: TeamService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

    this.utility = new Utility();

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));

    this.currentCourse.pipe(
      concatMap(course => this.courseService.getAllTeams(course.name)),
      concatMap(teamList => {
        this.teamList = teamList;
        return teamList;
      }),
      tap(team => {
        this.setTeamMembersAndVms(team);
    })).subscribe();

    this.currentCourse.pipe(
      concatMap(course => {
        return this.courseService.getAllProposals(course.name);
      }),
      concatMap(teamProposalList => {
        this.allProposals = teamProposalList;
        this.pendingProposals = teamProposalList.filter(proposal => proposal.status === TeamProposalStatus.PENDING);
        return teamProposalList;
      }),
      tap(proposal => {
        /*
        this.teamService.getTeamProposalMembers(proposal.id).subscribe(members => proposal.members = members);
        this.studentService.find(proposal.creatorId).subscribe(creator => proposal.creator = creator);
        */
        const memberList = this.teamService.getTeamProposalMembers(proposal.id);
        const proposalCreator = this.studentService.find(proposal.creatorId);

        forkJoin([memberList, proposalCreator]).subscribe(results => {
          // set team proposal members and vms
          proposal.members = results[0];
          proposal.creator = results[1];

          // check if this is one of my team proposals and it is PENDING
          if (proposal.members.find(m => m.id === this.utility.getMyId())
              && proposal.status === TeamProposalStatus.PENDING) {
            this.myPendingProposals.push(proposal);
          }
        });
      })).subscribe();

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getTeamedUpStudents(course.name);
      })).subscribe(studentList => this.teamedUpStudents = studentList);

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getNotTeamedUpStudents(course.name);
      })).subscribe(studentList => this.notTeamedUpStudents = studentList);

    this.currentCourse
      .pipe(concatMap(course => {
        return this.studentService.checkAcceptedProposals(this.utility.getMyId(), course.name);
      })).subscribe(accepted => this.hasAcceptedAProposal = accepted);
  }

  ngOnInit(): void {
  }

  findTeam(studentId: string) {
    if (this.teamList)
      return this.teamList.find(team => team.members?.find(student => student.id === studentId));
  }

  async openDialog(team: Team) {

    // Prepare the message
    const message = 'This will delete the team ' + team.name + ' from this course';

    // Open a dialog and get the response as an 'await'
    const areYouSure = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
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
          this.notificationService.sendMessage(emails, data.subject, data.body).subscribe( () => {
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
      students: notTeamedUpStudents,
      myId,
      minTeamSize: course.minTeamSize,
      maxTeamSize: course.maxTeamSize,
    };
    const dialogRef = this.dialog.open(TeamProposalDialogComponent, {disableClose: true, data});
    const dialogResponse: any = await dialogRef.afterClosed().toPromise();

    if (!!dialogResponse) {
      const studentIds = dialogResponse.students.map(s => s.id);
      this.teamService.proposeTeam(dialogResponse.teamName, course.name, studentIds)
        .pipe(
        catchError(err => {
          if (err.status === 503)
            this.mySnackBar.openSnackBar('Error while sending the email. Student may not have received the email correctly', MessageType.ERROR, 3);
          else
            this.mySnackBar.openSnackBar('Team proposal failed', MessageType.ERROR, 3);
          return EMPTY;
        }),
        concatMap(tpId => this.teamService.getTeamProposal(tpId))
        )
        .subscribe(teamProposal => {
          teamProposal.creator = dialogResponse.students.find(s => s.id === teamProposal.creatorId);
          teamProposal.members = dialogResponse.students;
          teamProposal.expiryDate = this.utility.localDateTimeToString(teamProposal.expiryDate);
          this.pendingProposals.push(teamProposal);
          this.myPendingProposals.push(teamProposal);
          this.hasAcceptedAProposal = false;
          this.mySnackBar.openSnackBar('Team proposed successfully', MessageType.SUCCESS, 3);
        });
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

    this.notificationService.responseToProposalById('accept', tp.id, this.utility.getMyId()).subscribe(resp => {
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
        this.mySnackBar.openSnackBar('Team proposal accepted successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('Team proposal accept failed', MessageType.ERROR, 3);
      }
    });
  }

  rejectTeamProposal(tpId: number) {
    this.notificationService.responseToProposalById('reject', tpId, this.utility.getMyId()).subscribe(resp => {
      if (resp) {
        // remove rejected team proposal from my pending proposals
        const tpToReject = this.myPendingProposals.find(tp => tp.id === tpId);
        if (tpToReject) {
          this.myPendingProposals.splice(this.pendingProposals.indexOf(tpToReject), 1);
          const tpMembers = this.pendingProposals.find(tp => tp.id === tpId).members;
          tpMembers.splice(tpMembers.map(m => m.id).indexOf(this.utility.getMyId()));
        }

        this.mySnackBar.openSnackBar('Team proposal rejected successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('Team proposal reject failed', MessageType.ERROR, 3);
      }
    });
  }

  setTeamMembersAndVms(team: Team) {
    const memberList = this.teamService.getTeamMembers(team.id);
    const vmList = this.teamService.getTeamVms(team.id);

    forkJoin([memberList, vmList]).subscribe(results => {
      // set team members and vms
      team.members = results[0];
      team.vms = results[1];

      // check if this is my team
      if (team.members.find(m => m.id === this.utility.getMyId())) {
        this.myTeam = team;
      }
    });
  }

  deleteTeam(team: Team) {
    this.teamList.splice(this.teamList.indexOf(team), 1);
    this.mySnackBar.openSnackBar('Team removed successfully', MessageType.SUCCESS, 3);
    return;
    this.teamService.deleteTeam(team.id).subscribe(() => {
      this.teamList.splice(this.teamList.indexOf(team), 1);
      this.mySnackBar.openSnackBar('Team removed successfully', MessageType.SUCCESS, 3);
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
    return this.teamedUpStudents?.length > 0 && this.teamedUpStudents?.find(s => s.id === this.utility.getMyId());
  }
}
