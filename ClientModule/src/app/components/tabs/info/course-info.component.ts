import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Course} from '../../../models/course.model';
import {CourseService} from '../../../services/course.service';
import {Observable, Subscription} from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';
import {CourseInfo} from '../../../models/course-info.model';
import {Professor} from '../../../models/professor.model';
import Utility from '../../../helpers/utility';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit, OnDestroy {
  private currentCourse: Observable<Course>;
  courseInfo: CourseInfo;
  courseProfessors: Professor[];

  private subscriptions: Subscription;
  public utility: Utility;

  constructor(private courseService: CourseService) {

    this.subscriptions = new Subscription();
    this.utility = new Utility();

    this.courseInfo = new CourseInfo('', '', '', '', '', '', '');
    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));

    this.subscriptions.add(
      this.currentCourse.subscribe(
      data => {
        if (data && data.info && data.info.length !== 0) {
          try {
            // parse json file
            const info = JSON.parse(data.info);

            // construct CourseInfo object
            this.courseInfo = new CourseInfo(data.name, data.acronym, data.minTeamSize.toString(),
              data.maxTeamSize.toString(), this.utility.formatText(info.description),
              this.utility.formatText(info.prerequisites), this.utility.formatText(info.topics));
          } catch (e) {
            this.clearInfo();
          }
        } else {
          this.clearInfo();
        }
      }));

    this.subscriptions.add(
      this.currentCourse
        .pipe(concatMap(course => {
          return this.courseService.getProfessors(course.name);
        })).subscribe(professorList => {
          this.courseProfessors = professorList;
        }));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.utility.renderChartPasses();
      this.utility.renderChartGrades();
    }, 300);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clearInfo() {
    if (this.courseInfo) {
      this.courseInfo.description = '';
      this.courseInfo.prerequisites = '';
      this.courseInfo.topics = '';
    }
  }
}
