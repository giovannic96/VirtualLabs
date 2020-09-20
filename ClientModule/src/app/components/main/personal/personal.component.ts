import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../models/course.model';
import {Router} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {MatSidenav} from '@angular/material/sidenav';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../../../helpers/dialog/course-dialog.component';
import Utility from '../../../helpers/utility';
import {filter} from 'rxjs/operators';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {Observable} from 'rxjs';
import {ProfessorService} from '../../../services/professor.service';
import {StudentService} from '../../../services/student.service';
import {MyDialogComponent} from "../../../helpers/dialog/my-dialog.component";
import {Vm} from "../../../models/vm.model";

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

  openCourseDialog(courseName?: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      courseExists: false,
      course: null
    };

    if (courseName) {
      const course = this.myCourses.find(c => c.name === courseName);
      if (course) {
        dialogConfig.data.courseExists = true;
        dialogConfig.data.course = course;
      }
    }

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig)
      .afterClosed().pipe().subscribe((course: Course) => {
        if (dialogConfig.data.courseExists) {
          if (course == null) {
            this.mySnackBar.openSnackBar('Impossible to create new course. Try again later.', MessageType.ERROR, 5);
          } else {
            const editedCourse = this.myCourses.find(c => c.name === course.name);
            editedCourse.name = course.name;
            editedCourse.acronym = course.acronym;
            editedCourse.enabled = course.enabled;
            editedCourse.minTeamSize = course.minTeamSize;
            editedCourse.maxTeamSize = course.maxTeamSize;
            editedCourse.info = course.info;
            this.setCurrentCourse(editedCourse);
            this.mySnackBar.openSnackBar('Course edited successfully', MessageType.SUCCESS, 3);
          }
        } else {
          if (course == null) {
            this.mySnackBar.openSnackBar('Impossible to create new course. Try again later.', MessageType.ERROR, 5);
          } else {
            this.mySnackBar.openSnackBar('New course created successfully', MessageType.SUCCESS, 3);
            this.myCourses.push(course);
            this.myCourses.sort((a, b) => Course.sortData(a, b));
          }
        }
      });
  }

  async deleteCourse(courseName: string) {
    // Prepare the message
    const message = 'This will delete also all the teams, team proposals, assignments and vm model related to this course';

    // Open a dialog and get the response as an 'await'
    const areYouSure = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
        message,
        buttonConfirmLabel: 'CONFIRM',
        buttonCancelLabel: 'CANCEL'
      }
    }).afterClosed().toPromise();

    // Check the response when dialog closes
    if (areYouSure) {
      this.courseService.deleteCourse(courseName).subscribe(() => {
        this.mySnackBar.openSnackBar('Course deleted successfully', MessageType.SUCCESS, 3);
        const index = this.myCourses.findIndex(c => c.name === courseName);
        this.myCourses.splice(index, 1);
        this.router.navigate(['courses/']);
      }, error => {
        this.mySnackBar.openSnackBar('Impossible to delete this course', MessageType.ERROR, 5);
      });
    }
  }
}
