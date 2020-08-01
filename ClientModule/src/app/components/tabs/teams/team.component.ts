import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {Course} from '../../../models/course.model';
import {concatMap, filter, flatMap, map, mergeMap, switchMap, take, toArray} from 'rxjs/operators';
import {forkJoin, from, Observable, of} from 'rxjs';
import {Team} from '../../../models/team.model';
import {Vm} from '../../../models/vm.model';
import {Student} from '../../../models/student.model';
import {StudentService} from '../../../services/student.service';
import {TeamService} from '../../../services/team.service';
import {TeamProposal} from '../../../models/team-proposal.model';

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

    this.currentCourse = this.courseService.getSelectedCourse();

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getAllTeams(course.name);
      }))
      .pipe(mergeMap(teamList => {
        this.teamList = teamList;
        return teamList;
      })).pipe(map(team => {
        team.members = this.teamService.getTeamMembers(team.id);
        team.vms = this.teamService.getTeamVms(team.id);
    })).subscribe();

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getAllProposals(course.name);
      })).pipe(map(teamProposalList => {
        teamProposalList.forEach(proposal => {
          proposal.members = this.teamService.getTeamProposalMembers(proposal.id);
          proposal.creator = this.studentService.find(proposal.creatorId);
        });
        return teamProposalList;
      })).subscribe(list => {
        this.allProposals = list;
        this.pendingProposals = list.filter(proposal => proposal.status === 'PENDING');
      });

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getTeamedUpStudents(course.name);
      }))
      .subscribe(studentList => this.teamedUpStudents = studentList);

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getNotTeamedUpStudents(course.name);
      })).subscribe(studentList => this.notTeamedUpStudents = studentList);
  }

  ngOnInit(): void {
  }

}
