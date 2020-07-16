import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {User} from "../auth/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userLoggedObs : BehaviorSubject<User>;
  redirectUrl: string;

  constructor(private httpClient: HttpClient) {
    let user: User = null;
    const localStorageItem = localStorage.getItem('tokenLab5');
    if(localStorageItem) {
      user = JSON.parse(atob(localStorageItem.split('.')[1]));
    }
    this.userLoggedObs = new BehaviorSubject<User>(user);
  }

  login(email: string, password: string): Observable<any> {
    const credentials = {
      email, password
    };
    return this.httpClient.post<any>('https://localhost:4200/api/login', credentials);
  }

  logout() {
    localStorage.removeItem('tokenLab5');
    this.setUserLogged(null);
  }

  setUserLogged(val: User) {
    this.userLoggedObs.next(val);
  }

  getUserLogged(): Observable<User> {
    return this.userLoggedObs.asObservable();
  }

  getAuthorizationToken() {
    return localStorage.getItem('tokenLab5');
  }

  isUserLogged(): boolean {
    return !!this.userLoggedObs.value;
  }

  isTokenExpired(): boolean {
    const now = new Date();
    const user = this.userLoggedObs.value;
    return user && (this.userLoggedObs.value.exp < now.getTime()/1000);
  }
}
