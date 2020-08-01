import { Component, OnInit } from '@angular/core';
import {VmService} from '../../../services/vm.service';
import {TeamService} from '../../../services/team.service';
import {CourseService} from '../../../services/course.service';
import {catchError, concatAll, concatMap, filter, map, mergeAll, mergeMap, tap, toArray} from 'rxjs/operators';
import {forkJoin, Observable, of} from 'rxjs';
import {Course} from '../../../models/course.model';
import {Team} from '../../../models/team.model';
import {Vm} from '../../../models/vm.model';

@Component({
  selector: 'app-vm',
  templateUrl: './vm.component.html',
  styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

  private currentCourse: Observable<Course>;

  public teamList: Team[];

  constructor(private vmService: VmService,
              private teamService: TeamService,
              private courseService: CourseService) {

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));

    this.currentCourse.pipe(
      concatMap(course => {
        return this.courseService.getAllTeams(course.name);
      }),
      concatMap(teamList => {
        this.teamList = teamList;
        return teamList;
      }),
      mergeMap(team => {
        this.teamService.getTeamVms(team.id).subscribe(vms => team.vms = vms);
        return of(null);
      })).subscribe();

  }

  ngOnInit(): void {
  }

}
