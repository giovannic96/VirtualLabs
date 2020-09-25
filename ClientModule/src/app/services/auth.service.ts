import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Token} from '../models/token.model';
import {Course} from '../models/course.model';
import {catchError, retry} from 'rxjs/operators';
import {Student} from '../models/student.model';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private API_PATH = 'https://virtuallabs.ns0.it/auth';
  private API_PATH = 'http://localhost:8080/auth';

  private tokenLoggedObs: BehaviorSubject<Token>;
  private userLoggedObs: BehaviorSubject<User>;
  redirectUrl: string;

  constructor(private httpClient: HttpClient) {
    let token: Token = null;
    const localStorageItem = localStorage.getItem('virtuallabs_token');
    if (localStorageItem) {
      token = JSON.parse(atob(localStorageItem.split('.')[1]));
    }
    this.tokenLoggedObs = new BehaviorSubject<Token>(token);
    this.userLoggedObs = new BehaviorSubject<User>(null);
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

  logout() {
    localStorage.removeItem('virtuallabs_token');
    this.setUserTokenLogged(null);
  }

  setUserTokenLogged(val: Token) {
    this.tokenLoggedObs.next(val);
  }

  getUserTokenLogged(): Observable<Token> {
    return this.tokenLoggedObs.asObservable();
  }

  setUserLogged(val: User) {
    this.userLoggedObs.next(val);
  }

  getUserLogged(): Observable<User> {
    return this.userLoggedObs.asObservable();
  }

  getAuthorizationToken() {
    return localStorage.getItem('virtuallabs_token');
  }

  isUserLogged(): boolean {
    return !!this.tokenLoggedObs.value;
  }

  isProfessor(): boolean {
    return this.userLoggedObs?.value.roles.includes('ROLE_PROFESSOR');
  }

  getUserId(): string {
    return this.userLoggedObs?.value.id;
  }

  isTokenExpired(): boolean {
    const now = new Date();
    const token = this.tokenLoggedObs.value;
    return token && (this.tokenLoggedObs.value.exp < now.getTime() / 1000);
  }
}
