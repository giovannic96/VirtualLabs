import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../models/course.model';
import {Router} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {MatSidenav} from '@angular/material/sidenav';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreateCourseDialogComponent} from '../../../helpers/dialog/create-course-dialog.component';
import Utility from '../../../helpers/utility';
import {filter} from 'rxjs/operators';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {Observable} from 'rxjs';
import {ProfessorService} from '../../../services/professor.service';
import {StudentService} from '../../../services/student.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  @ViewChild(MatSidenav) sideNav: MatSidenav;

  myCourses: Course[];

  selectedCourseName: string;
  navLinks: any[];
  activeLinkIndex = -1;

  public utility: Utility;

  constructor(private courseService: CourseService,
              private professorService: ProfessorService,
              private studentService: StudentService,
              private router: Router,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

    this.utility = new Utility();

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

    this.myCourses = new Array<Course>();
    this.selectedCourseName = '';

    this.courseService.hideMenu.next(false);
    this.courseService.hideMenuIcon.next(false);

    let coursesRequest: Observable<Course[]>;
    if (this.utility.isProfessor())
      coursesRequest = this.professorService.getCourses(this.utility.getMyId());
    else
      coursesRequest = this.studentService.getCourses(this.utility.getMyId());

    coursesRequest.subscribe(courseList => {
      this.myCourses = courseList;

      let courseToNavigate: string;
      let tabToVisit: string;

      if (courseList.length) {
        const splitUrl = this.router.url.split('/');
        if (splitUrl.length > 2) {
          courseList.find(course => {
            if (course.name.replace(/ /g, '%20') === this.router.url.split('/')[2]) {
              this.setCurrentCourse(course);
              courseToNavigate = course.name;
              tabToVisit = splitUrl.length > 3 ? this.router.url.split('/')[3] : '';
            }
          });
        }
        if (!courseToNavigate) {
          this.setCurrentCourse(courseList[0]);
          courseToNavigate = courseList[0].name;
          tabToVisit = '';
        }
        this.router.navigate(['courses/' + courseToNavigate + '/' + tabToVisit]);
      }
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

  openCreateCourseDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(CreateCourseDialogComponent, dialogConfig)
      .afterClosed().pipe(filter(result => result)).subscribe(course => {
        if (course === -1) {
          this.mySnackBar.openSnackBar('Impossible to create new course. Try again later.', MessageType.ERROR, 5);
        } else {
          this.mySnackBar.openSnackBar('New course created successfully', MessageType.SUCCESS, 3);
          this.myCourses.push(course);
          this.myCourses.sort((a, b) => Course.sortData(a, b));
        }
    });
  }
}
