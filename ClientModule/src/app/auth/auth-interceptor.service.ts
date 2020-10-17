import { Injectable } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, EMPTY, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  private readonly REMOTE_SERVER = 'virtuallabs.ns0.it';
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req = this.switchRequestForRemoteServer(request, true, true);
    // This method above just switch the request to the remote server
    // Set last parameter to false to disable it and to left the requests go to localhost

    const authToken = this.authService.getAuthorizationToken();
    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
        /* Auth token expired */
        if (error.status === 600) {

          /* First failed request */
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            if (this.authService.isUserLogged()) {
              const refreshToken = localStorage.getItem('refresh_token');

              if (refreshToken) {
                return this.authService.refreshToken(refreshToken).pipe(
                  switchMap(map => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(map.auth_token);
                    this.authService.setUserTokenLogged(map.auth_token);
                    localStorage.setItem('auth_token', map.auth_token);
                    const newReq = req.clone({
                      headers: req.headers.set('Authorization', 'Bearer ' + map.auth_token)
                    });
                    return next.handle(newReq);
                  }));
              } else {
                this.authService.logout();
                alert('Session expired.\nPlease login again...');
                this.isRefreshing = false;
                this.router.navigate(['/'], {queryParams: {doLogin: true}});
              }
            }
            return EMPTY;
          }
          /* Other failed requests wait for refresh */
          else {
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(token => {
                const newReq = req.clone({
                  headers: req.headers.set('Authorization', 'Bearer ' + token)
                });
                return next.handle(newReq);
              }));
          }
        }
        /* Refresh token expired */
        else if (error.status === 511) {
          this.authService.logout();
          alert('Session expired.\nPlease login again...');
          this.isRefreshing = false;
          this.router.navigate(['/'], {queryParams: {doLogin: true}});
          return EMPTY;
        }
        return throwError(error);
      }));
    } else {
      return next.handle(req);
    }
  }

  private switchRequestForRemoteServer(request: HttpRequest<any>, ssl?: boolean, wannaSwitch?: boolean) {
    if (!wannaSwitch)
      return request;

    const protocol: string = ssl ? 'https' : 'http';

    // Eg. http://server_name/api/something/else
    const uri = request.url.split('//')[1];  // = server_name/api/something/else
    const location = uri.substring(uri.indexOf('/')); // = /api/something/else

    return request.clone({
      url: protocol + '://' + this.REMOTE_SERVER + location
    });
  }
}
