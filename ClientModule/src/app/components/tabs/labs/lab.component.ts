import { Component, OnInit } from '@angular/core';
import {Assignment} from '../../../models/assignment.model';
import {concatMap, filter, tap} from 'rxjs/operators';
import {CourseService} from '../../../services/course.service';
import {Observable} from 'rxjs';
import {Course} from '../../../models/course.model';
import {LabService} from '../../../services/lab.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit {

  private currentCourse: Observable<Course>;
  public assignmentList: Assignment[];

  constructor(private courseService: CourseService,
              private labService: LabService) {

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));

    this.currentCourse.pipe(
      concatMap(course => this.courseService.getAllAssignments(course.name)),
      concatMap(assignmentList => {
        this.assignmentList = assignmentList;
        return assignmentList;
      }),
      tap(assignment => {
        this.labService.getAssignmentReports(assignment.id).subscribe(reports => assignment.reports = reports);
      })).subscribe();
  }

  ngOnInit(): void {
  }

  formatDate(date: string) {
    const splitted = date.toString().split(',').map(s => Number(s));
    return new Date(splitted[0], splitted[1] - 1, splitted[2], splitted[3], splitted[4], splitted[5]);
  }
}
