import { Injectable } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthorizationToken();
    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(cloned).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 600) {
          if (this.authService.isUserLogged()) {
            this.authService.logout();
            alert('Sorry but your session has expired.\nPlease login again...');
            this.router.navigate(['/'], {queryParams: {doLogin: true}});
          }
          return EMPTY;
        }
        return throwError(error);
      }));
    } else {
      return next.handle(req);
    }
  }
}
