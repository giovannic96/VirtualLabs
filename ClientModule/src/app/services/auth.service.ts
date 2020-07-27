import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Token} from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenLoggedObs: BehaviorSubject<Token>;
  redirectUrl: string;

  constructor(private httpClient: HttpClient) {
    let token: Token = null;
    const localStorageItem = localStorage.getItem('tokenVirtualLabs');
    if (localStorageItem) {
      token = JSON.parse(atob(localStorageItem.split('.')[1]));
    }
    this.tokenLoggedObs = new BehaviorSubject<Token>(token);
  }

  login(email: string, password: string): Observable<any> {
    const credentials = {
      email, password
    };
    return this.httpClient.post<any>('https://localhost:4200/login', credentials);
  }

  signup(email: string, password: string): Observable<any> {
    const credentials = {
      email, password
    };
    return this.httpClient.post<any>('https://localhost:4200/signup', credentials);
  }

  logout() {
    localStorage.removeItem('tokenLab5');
    this.setUserLogged(null);
  }

  setUserLogged(val: Token) {
    this.tokenLoggedObs.next(val);
  }

  getUserLogged(): Observable<Token> {
    return this.tokenLoggedObs.asObservable();
  }

  getAuthorizationToken() {
    return localStorage.getItem('tokenVirtualLabs');
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
