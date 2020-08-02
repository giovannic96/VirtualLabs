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
              private teamService: TeamService) {

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

}
