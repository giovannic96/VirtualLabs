import { Component, OnInit } from '@angular/core';
import {Course} from '../../../models/course.model';
import {Router} from '@angular/router';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {


  allCourses: Course[];
  selectedCourseName: string;
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private courseService: CourseService,
              private router: Router) {

    this.navLinks = [
      {
        label: 'Students',
        path: '/students',
        index: 0
      }, {
        label: 'Teams',
        path: '/teams',
        index: 1
      }, {
        label: 'VMs',
        path: '/vms',
        index: 2
      }, {
        label: 'Labs',
        path: '/labs',
        index: 3
      }, {
        label: 'Info',
        path: '/info',
        index: 4
      }
    ];

    this.allCourses = new Array<Course>();
    this.selectedCourseName = '';

    this.courseService.getAll().subscribe(courseList => {
      this.allCourses = courseList;
      if (courseList.length)
        this.setCurrentCourse(courseList[0]);

      this.router.navigate(['courses/' + courseList[0].name + '/students']);
    });

    this.courseService.getSelectedCourse().subscribe(course => {
      this.selectedCourseName = course ? course.name : '';
    });

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

  ngOnInit(): void {
  }

  setCurrentCourse(course: Course) {
    this.courseService.setSelectedCourse(course);
  }
}
