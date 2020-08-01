import { Component, OnInit } from '@angular/core';
import {VmService} from '../../../services/vm.service';
import {TeamService} from '../../../services/team.service';
import {CourseService} from '../../../services/course.service';
import {concatMap, map, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Course} from '../../../models/course.model';
import {Team} from '../../../models/team.model';

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

    this.currentCourse = this.courseService.getSelectedCourse();

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getAllTeams(course.name);
      }))
      .pipe(mergeMap(teamList => {
        this.teamList = teamList;
        return teamList;
      })).pipe(map(team => {
        team.vms = this.teamService.getTeamVms(team.id);
    })).subscribe();
  }

  ngOnInit(): void {
  }

}
