import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {AuthService} from './services/auth.service';
import {CourseService} from './services/course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VirtualLabs';
  userLoggedIn: boolean;
  menuIconHidden: boolean;
  menuHidden: boolean;

  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog) {

    this.courseService.hideMenuIcon.subscribe(hideMenuIcon => this.menuIconHidden = hideMenuIcon);
    this.courseService.hideMenu.subscribe(hideMenu => this.menuHidden = hideMenu);

    this.authService.getUserLogged().subscribe(userLogged => {
      if (!!userLogged) {
        if (this.authService.isTokenExpired()) {
          localStorage.removeItem('tokenVirtualLabs');
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

  toggleSidenav(event: Event) {
    this.courseService.clicksOnMenu.next(event);
  }

}
