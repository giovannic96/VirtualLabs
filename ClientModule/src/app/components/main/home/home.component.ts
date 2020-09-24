import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {AuthService} from '../../../services/auth.service';
import {LoginDialogComponent} from '../../../auth/login-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SignupDialogComponent} from '../../../auth/signup-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  desktopAppLink = 'https://virtuallabs.ns0.it/installers/VirtualLabs-x64-setup.exe';
  requestComplete: boolean;

  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog)
  {
    this.courseService.hideMenu.next(false);
    this.courseService.hideMenuIcon.next(true);
  }

  ngOnInit(): void {
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.authService.redirectUrl) {
          this.router.navigate([this.authService.redirectUrl]);
          this.authService.redirectUrl = '';
        } else {
          this.router.navigate(['courses']);
        }
      }
    });
  }

  openSignupDialog() {
    const dialogRef = this.dialog.open(SignupDialogComponent);
    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.requestComplete = true;
      }
    });
  }

}
