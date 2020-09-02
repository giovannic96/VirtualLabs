import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {Course} from '../../../models/course.model';
import {catchError, concatMap, filter, tap} from 'rxjs/operators';
import {EMPTY, Observable} from 'rxjs';
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
import {AllTeamedUpDialogComponent} from '../../../helpers/dialog/all-teamed-up-dialog.component';
import {HasAlreadyProposedDialogComponent} from '../../../helpers/dialog/has-already-proposed-dialog.component';
import Utility from '../../../helpers/utility';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css', '../../../helpers/add-btn-round.css']
})
export class TeamComponent implements OnInit {

  teams: {team: Team, students: Student[], vms: Vm[]}[] = [];
  private currentCourse: Observable<Course>;
  public teamList: Team[];

  public allProposals: TeamProposal[];
  public pendingProposals: TeamProposal[];

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
        this.teamService.getTeamMembers(team.id).subscribe(members => team.members = members);
        this.teamService.getTeamVms(team.id).subscribe(vms => team.vms = vms);
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
        this.teamService.getTeamProposalMembers(proposal.id).subscribe(members => proposal.members = members);
        this.studentService.find(proposal.creatorId).subscribe(creator => proposal.creator = creator);
      })).subscribe();

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getTeamedUpStudents(course.name);
      })).subscribe(studentList => this.teamedUpStudents = studentList);

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getNotTeamedUpStudents(course.name);
      })).subscribe(studentList => this.notTeamedUpStudents = studentList);
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

  openAllTeamedUpDialog(message: string) {
    this.dialog.open(AllTeamedUpDialogComponent, {disableClose: true, data: { message }});
  }

  openHasAlreadyProposedDialog(message: string) {
    this.dialog.open(HasAlreadyProposedDialogComponent, {disableClose: true, data: { message }});
  }

  async openTeamProposalDialog(notTeamedUpStudents: Student[]) {
    const course: Course = this.courseService.getSelectedCourseValue();

    const data = {
      teamName: '',
      students: notTeamedUpStudents,
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
          this.mySnackBar.openSnackBar('Team proposed successfully', MessageType.SUCCESS, 3);
        });
    }
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

  hasAlreadyProposed(studentId: string) {
    let found = false;
    this.pendingProposals.forEach(tp => {
      found = tp.members.some(s => s.id === studentId);
    });
    return found;
  }
}
