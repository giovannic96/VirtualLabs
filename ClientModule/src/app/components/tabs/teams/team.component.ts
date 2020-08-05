import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {Course} from '../../../models/course.model';
import {concatMap, filter, flatMap, map, mergeMap, switchMap, take, tap, toArray} from 'rxjs/operators';
import {forkJoin, from, Observable, of} from 'rxjs';
import {Team} from '../../../models/team.model';
import {Vm} from '../../../models/vm.model';
import {Student} from '../../../models/student.model';
import {StudentService} from '../../../services/student.service';
import {TeamService} from '../../../services/team.service';
import {TeamProposal, TeamProposalStatus} from '../../../models/team-proposal.model';
import {VmModel} from '../../../models/vm-model.model';
import {MyDialogComponent} from '../../../helpers/my-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: {team: Team, students: Student[], vms: Vm[]}[] = [];
  private currentCourse: Observable<Course>;
  public teamList: Team[];

  public allProposals: TeamProposal[] = [];
  public pendingProposals: TeamProposal[] = [];

  public teamedUpStudents: Student[] = [];
  public notTeamedUpStudents: Student[] = [];

  constructor(private courseService: CourseService,
              private studentService: StudentService,
              private teamService: TeamService,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

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

  deleteTeam(team: Team) {
    this.teamList.splice(this.teamList.indexOf(team), 1);
    this.mySnackBar.openSnackBar('Team removed successfully', MessageType.SUCCESS, 3);
    return;
    this.teamService.deleteTeam(team.id).subscribe(() => {
      this.teamList.splice(this.teamList.indexOf(team), 1);
      this.mySnackBar.openSnackBar('Team removed successfully', MessageType.SUCCESS, 3);
    });
  }

}
