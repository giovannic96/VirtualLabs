import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {HomeComponent} from '../components/main/home/home.component';
import {StudentsComponent} from '../components/tabs/students/students.component';

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
    const isLogged: boolean = this.authService.isUserLogged();

    if (isLogged) {
      if (route.component === HomeComponent) {
        this.authService.redirectUrl = '';
        this.router.navigate(['courses']);
        return false;
      }

      if (route.component === StudentsComponent && !this.authService.isProfessor()) {
        alert('You are unauthorized to access this page!');
        this.router.navigate(['courses']);
        return false;
      }
    }

    if (!isLogged && route.component !== HomeComponent){
      this.authService.redirectUrl = url;
      this.router.navigate(['home'], {queryParams: {doLogin: true}});
      return false;
    }

    return true;
  }
}
