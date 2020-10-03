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
        /* Auth token expired */
        if (error.status === 600) {
          if (this.authService.isUserLogged()) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              this.authService.refreshToken(refreshToken).subscribe(map => {
                console.log(map);
              }, err => console.error(err));
            } else {
              this.authService.logout();
              alert('Session expired.\nPlease login again...');
              this.router.navigate(['/'], {queryParams: {doLogin: true}});
            }
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
