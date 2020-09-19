import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Token} from '../models/token.model';
import {Course} from '../models/course.model';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private API_PATH = 'https://virtuallabs.ns0.it/auth';
  private API_PATH = 'http://localhost:8080/auth';

  private tokenLoggedObs: BehaviorSubject<Token>;
  redirectUrl: string;

  constructor(private httpClient: HttpClient) {
    let token: Token = null;
    const localStorageItem = localStorage.getItem('virtuallabs_token');
    if (localStorageItem) {
      token = JSON.parse(atob(localStorageItem.split('.')[1]));
    }
    this.tokenLoggedObs = new BehaviorSubject<Token>(token);
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.API_PATH}/login`, {username: email, password})
      .pipe(
        retry(1),
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
        retry(1),
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
          return throwError(`Signup error: ${err.message}`);
        })
      );
  }

  logout() {
    localStorage.removeItem('virtuallabs_token');
    this.setUserLogged(null);
  }

  setUserLogged(val: Token) {
    this.tokenLoggedObs.next(val);
  }

  getUserLogged(): Observable<Token> {
    return this.tokenLoggedObs.asObservable();
  }

  getAuthorizationToken() {
    return localStorage.getItem('virtuallabs_token');
  }

  isUserLogged(): boolean {
    return !!this.tokenLoggedObs.value;
  }

  isTokenExpired(): boolean {
    const now = new Date();
    const token = this.tokenLoggedObs.value;
    return token && (this.tokenLoggedObs.value.exp < now.getTime() / 1000);
  }
}
