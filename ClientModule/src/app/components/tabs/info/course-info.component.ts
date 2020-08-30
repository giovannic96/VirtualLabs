import { Component, OnInit } from '@angular/core';
import {Course} from '../../../models/course.model';
import {CourseService} from '../../../services/course.service';
import {Observable} from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';
import {CourseInfo} from '../../../models/course-info.model';
import * as CanvasJS from './canvasjs.min';
import {Professor} from '../../../models/professor.model';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  private currentCourse: Observable<Course>;
  courseInfo: CourseInfo;
  courseProfessors: Professor[];

  constructor(private courseService: CourseService) {
    this.courseInfo = new CourseInfo('', '', '', '', '', '', '');
    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));

    this.currentCourse.subscribe(
      data => {
        if (data && data.info && data.info.length !== 0) {
          try {
            // parse json file
            const info = JSON.parse(data.info);

            // construct CourseInfo object
            this.courseInfo = new CourseInfo(data.name, data.acronym, data.minTeamSize.toString(),
              data.maxTeamSize.toString(), this.format(info.description), this.format(info.prerequisites),
              this.format(info.topics));
          } catch (e) {
            this.clearInfo();
          }
        } else {
          this.clearInfo();
        }
      }
    );

    this.currentCourse
      .pipe(concatMap(course => {
        return this.courseService.getProfessors(course.name);
      })).subscribe(professorList => {
        this.courseProfessors = professorList;
      });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.renderChartPasses();
      this.renderChartGrades();
    }, 600);
  }

  clearInfo() {
    if (this.courseInfo) {
      this.courseInfo.description = '';
      this.courseInfo.prerequisites = '';
      this.courseInfo.topics = '';
    }
  }

  format(str: string): string {
    return str.replace(/\n/g, '<br/>').replace(/\u0009/g, '&emsp;');
  }

  renderChartPasses() {
    const enrolledPassesNum = Math.random() * (36 - 2) + 2;
    const enrolledFailedNum = 40 - enrolledPassesNum;
    const firstTimeEnrolledPassesNum = Math.random() * (38 - 2) + 2;
    const firstTimeEnrolledFailedNum = 40 - firstTimeEnrolledPassesNum;
    const chart = new CanvasJS.Chart('chartContainerPasses', {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        fontFamily: 'Arial',
        text: 'Passes detail'
      },
      toolTip: {
        shared: true
      },
      legend: {
        fontSize: 16,
        fontFamily: 'Arial',
        fontColor: '#1e2f41',
        cursor: 'pointer',
        itemclick: this.toggleDataSeries,
      },
      height: 375,
      axisX: {
        margin: 10
      },
      axisY: {
        lineColor: 'rgb(74,219,97)',
        tickColor: 'rgb(74,219,97)',
        labelFontColor: 'rgb(74,219,97)',
        margin: 10,
      },
      axisY2: {
        lineColor: 'rgb(219,74,74)',
        tickColor: 'rgb(219,74,74)',
        labelFontColor: 'rgb(219,74,74)',
      },
      data: [{
        type: 'column',
        name: 'Passed exam',
        color: 'rgb(74,219,97)',
        showInLegend: true,
        yValueFormatString: '##0 students',
        dataPoints: [
          { label: 'Enrolled',  y: enrolledPassesNum },
          { label: 'First time enrolled', y: firstTimeEnrolledPassesNum },
        ]
      },
        {
          type: 'column',
          name: 'Failed exam',
          color: 'rgb(219,74,74)',
          axisYType: 'secondary',
          showInLegend: true,
          yValueFormatString: '##0 students',
          dataPoints: [
            { label: 'Enrolled', y: enrolledFailedNum },
            { label: 'First time enrolled', y: firstTimeEnrolledFailedNum },
          ]
        }],
    });
    chart.render();
  }

  renderChartGrades() {
    const dataPoints = [];
    let y = 0;
    for ( let i = 18; i < 31; i++ ) {
      // y += Math.round(2 + Math.random() * (-2 - 2));
      y = Math.floor(Math.random() * (40 + 1));
      dataPoints.push({y, label: i});
    }
    const chart = new CanvasJS.Chart('chartContainerGrades', {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        fontFamily: 'Arial',
        text: 'Grades detail'
      },
      legend: {
        fontSize: 16,
        fontFamily: 'Arial',
        fontColor: '#1e2f41',
      },
      height: 375,
      axisX: {
        title: 'Grade',
        margin: 10
      },
      axisY: {
        title: '# Students',
        margin: 10
      },
      data: [
        {
          type: 'line',
          showInLegend: false,
          name: 'number of enrolled students',
          dataPoints
        }]
    });
    chart.render();
  }

  toggleDataSeries(e) {
    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible);
    e.chart.render();
  }
}
