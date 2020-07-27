import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {AuthService} from './services/auth.service';
import {HomeComponent} from './components/home.component';
import {Course} from './models/course.model';
import {CourseService} from './services/course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  title = 'ai20-lab05';
  userLoggedIn: boolean;
  allCourses: Course[] = [];
  selectedCourseName: string;

  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog) {

    this.selectedCourseName = '';

    this.authService.getUserLogged().subscribe(userLogged => {
      if (!!userLogged) {
        if (this.authService.isTokenExpired()) {
          localStorage.removeItem('tokenLab5');
          this.userLoggedIn = false;
        } else {
          this.userLoggedIn = true;
        }
      } else {
        this.userLoggedIn = false;
      }
      console.log('User', userLogged);
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.doLogin) {
        this.openDialog();
      }
    });

    this.courseService.getSelectedCourse().subscribe(course => {
      this.selectedCourseName = course ? course.name : '';
    });

    this.courseService.getAll().subscribe(courseList => {
      this.allCourses = courseList;
      if (courseList.length)
        this.setCurrentCourse(courseList[0]);

      this.router.navigate(['courses/' + courseList[0].name + '/students']);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result && this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
        this.authService.redirectUrl = '';
      } else {
        this.router.navigate(['home']);
      }
    });
  }

  userLogout() {
    this.authService.logout();
    this.router.navigate(['home']);
  }

  redirectToLogin() {
    this.router.navigate(['/home'], { queryParams: {doLogin: true}});
  }

  toggleForMenuClick() {
    this.sideNav.toggle();
  }

  setCurrentCourse(course: Course) {
    this.courseService.setSelectedCourse(course);
  }
}
