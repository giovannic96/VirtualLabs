import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './helpers/dialog/login-dialog.component';
import {AuthService} from './services/auth.service';
import {CourseService} from './services/course.service';
import {Observable, throwError} from 'rxjs';
import {catchError, filter, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from './models/user.model';
import {AreYouSureDialogComponent} from './helpers/dialog/are-you-sure-dialog.component';

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

    this.authService.getUserTokenLogged().subscribe(userTokenLogged => this.userLoggedIn = !!userTokenLogged);

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.doLogin) {
        this.openLoginDialog();
      }
    });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(result => {
      if (this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
        this.authService.redirectUrl = '';
      } else {
        this.router.navigate(['courses']);
      }
    });
  }

  async userLogout() {
    const message = 'You will be redirected to Virtual Labs homepage';

    const areYouSure = await this.dialog.open(AreYouSureDialogComponent, {disableClose: true, data: {
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
