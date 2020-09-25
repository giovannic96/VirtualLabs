import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {HomeComponent} from '../components/main/home/home.component';
import {PersonalComponent} from '../components/main/personal/personal.component';
import {CourseInfoComponent} from '../components/tabs/info/course-info.component';
import {Course} from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkLogin(state.url, next);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkLogin(state.url, childRoute);
  }

  private checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    const isHome: boolean = route.component === HomeComponent;
    const isLogged: boolean = this.authService.isUserLogged();

    if (isHome && isLogged) {
      this.authService.redirectUrl = '';
      this.router.navigate(['courses']);
      return false;
    } else if (!isHome && !isLogged){
      this.authService.redirectUrl = url;
      this.router.navigate(['home'], {queryParams: {doLogin: true}});
      return false;
    }

    return true;
  }
}
