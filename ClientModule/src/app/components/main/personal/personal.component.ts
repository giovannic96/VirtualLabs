import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../models/course.model';
import {Router, RouterLinkActive} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  @ViewChild(MatSidenav) sideNav: MatSidenav;

  allCourses: Course[];
  selectedCourseName: string;
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private courseService: CourseService,
              private router: Router) {

    this.navLinks = [
      {
        label: 'Info',
        path: 'info',
        index: 0
      }, {
        label: 'Students',
        path: 'students',
        index: 1
      }, {
        label: 'Teams',
        path: 'teams',
        index: 2
      }, {
        label: 'VMs',
        path: 'vms',
        index: 3
      }, {
        label: 'Labs',
        path: 'labs',
        index: 4
      }
    ];

    this.allCourses = new Array<Course>();
    this.selectedCourseName = '';

    this.courseService.hideMenuIcon.next(false);

    this.courseService.getAll().subscribe(courseList => {
      this.allCourses = courseList;
      if (courseList.length)
        this.setCurrentCourse(courseList[0]);

      this.router.navigate(['courses/' + courseList[0].name]);
    });

    this.courseService.getSelectedCourse().subscribe(course => {
      this.selectedCourseName = course ? course.name : '';
    });

    this.courseService.clicksOnMenu.subscribe(event => this.sideNav.toggle());

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
