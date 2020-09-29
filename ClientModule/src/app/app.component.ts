import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {AuthService} from './services/auth.service';
import {CourseService} from './services/course.service';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from './models/user.model';
import {MyDialogComponent} from './helpers/dialog/my-dialog.component';

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
  currentUser: User;

  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog) {

    this.courseService.hideMenuIcon.subscribe(hideMenuIcon => this.menuIconHidden = hideMenuIcon);
    this.courseService.hideMenu.subscribe(hideMenu => this.menuHidden = hideMenu);

    this.authService.getUserLogged().subscribe(user => this.currentUser = user);

    this.authService.getUserTokenLogged().subscribe(userTokenLogged => {
      if (!!userTokenLogged) {
        if (this.authService.isTokenExpired()) {
          localStorage.removeItem('virtuallabs_token');
          this.userLoggedIn = false;
        } else {
          this.userLoggedIn = true;
        }
      } else {
        this.userLoggedIn = false;
      }
      console.log('UserToken', userTokenLogged);
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.doLogin) {
        this.openLoginDialog();
      }
    });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result && this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
        this.authService.redirectUrl = '';
      } else {
        this.router.navigate(['courses']);
      }
    });
  }

  async userLogout() {
    const message = 'You will be redirected to Virtual Labs homepage';

    const areYouSure = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
        message,
        buttonConfirmLabel: 'CONFIRM',
        buttonCancelLabel: 'CANCEL'
      }
    }).afterClosed().toPromise();

    if (areYouSure) {
      this.authService.logout();
      this.router.navigate(['home']);
    }
  }

  toggleSidenav(event: Event) {
    this.courseService.clicksOnMenu.next(event);
  }

}
