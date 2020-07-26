import {Component, OnInit, Output, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "./auth/login-dialog.component";
import {AuthService} from "./services/auth.service";
import {HomeComponent} from "./components/home.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  title = 'ai20-lab05';
  userLoggedIn: boolean;
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog) {

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
      if(params.doLogin) {
        this.openDialog();
      }
    });

    this.navLinks = [
      {
        label: 'Studenti',
        path: './teacher/course/applicazioni-internet/students',
        index: 0
      }, {
        label: 'Gruppi',
        path: './teacher/course/applicazioni-internet/groups',
        index: 1
      }, {
        label: 'VMs',
        path: './teacher/course/applicazioni-internet/vms',
        index: 2
      },
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      if(result && this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
        this.authService.redirectUrl = '';
      } else {
        this.router.navigate(['home']);
      }
    })
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
}
