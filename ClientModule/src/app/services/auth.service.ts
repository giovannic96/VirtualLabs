import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Token} from '../models/token.model';
import {Course} from '../models/course.model';
import {catchError, retry} from 'rxjs/operators';
import {Student} from '../models/student.model';
import {User} from '../models/user.model';

enum UserRole {
  UNDEFINED,
  STUDENT,
  PROFESSOR
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private API_PATH = 'https://virtuallabs.ns0.it/auth';
  private API_PATH = 'http://localhost:8080/auth';

  private tokenLoggedObs: BehaviorSubject<Token>;
  private userLoggedObs: BehaviorSubject<User>;
  userRole: UserRole;
  redirectUrl: string;

  constructor(private httpClient: HttpClient) {
    let token: Token = null;
    const localStorageItem = localStorage.getItem('auth_token');
    if (localStorageItem) {
      token = JSON.parse(atob(localStorageItem.split('.')[1]));
    }
    this.tokenLoggedObs = new BehaviorSubject<Token>(token);
    this.userLoggedObs = new BehaviorSubject<User>(null);
    this.userRole = UserRole.UNDEFINED;
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.API_PATH}/login`, {username: email, password})
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError(`Login error: ${err.message}`);
        })
      );
  }

  signup(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.API_PATH}/signup`, {username: email, password})
      .pipe(
        catchError( err => {
          console.error(err);
          return throwError(`Signup error: ${err.message}`);
        })
      );
  }

  confirmRegistration(token: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.API_PATH}/confirmRegistration`, null, {params: {token}})
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`Confirmation error: ${err.message}`);
        })
      );
  }

  getUserInfo(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.API_PATH}/me`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetUserInfo: ${err.message}`);
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    this.setUserTokenLogged(null);
    this.setUserLogged(null);
  }

  setUserTokenLogged(val: Token) {
    this.tokenLoggedObs.next(val);
  }

  getUserTokenLogged(): Observable<Token> {
    return this.tokenLoggedObs.asObservable();
  }

  setUserLogged(userInfo: any) {
    if (userInfo === null)
      this.userLoggedObs.next(null);
    else {
      const roles: string[] = userInfo.roles;
      if (roles.includes('ROLE_STUDENT'))
        this.userRole = UserRole.STUDENT;
      else if (roles.includes('ROLE_PROFESSOR'))
        this.userRole = UserRole.PROFESSOR;
      else
        this.userRole = UserRole.UNDEFINED;

      this.userLoggedObs.next(userInfo.user);
    }
  }

  getUserLogged(): Observable<User> {
    return this.userLoggedObs.asObservable();
  }

  getAuthorizationToken() {
    return localStorage.getItem('auth_token');
  }

  isUserLogged(): boolean {
    return !!this.tokenLoggedObs.value;
  }

  isProfessor(): boolean {
    return this.userRole === UserRole.PROFESSOR;
  }

  getMyId(): string {
    return this.userLoggedObs.value?.id;
  }

  isTokenExpired(): boolean {
    const now = new Date();
    const token = this.tokenLoggedObs.value;
    return token && (this.tokenLoggedObs.value.exp < now.getTime() / 1000);
  }

  refreshToken(token: string): Observable<any> {
      return this.httpClient
        .post<any>(`${this.API_PATH}/refreshToken`, token)
        .pipe(
          retry(1),
          catchError( err => {
            console.error(err);
            return throwError(`refreshToken error: ${err.message}`);
          })
        );
    }
}
