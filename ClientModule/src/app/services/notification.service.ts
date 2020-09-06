import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // private API_PATH = 'https://virtuallabs.ns0.it/notification';
  private API_PATH = 'http://localhost:8080/notification';

  constructor(private httpClient: HttpClient) { }

  sendMessage(to: string[], subject: string, body: string) {
    return this.httpClient
      .post<any>(`${this.API_PATH}/private/sendMessage`, {to, subject, body})
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`SendMessage error: ${err.message}`);
        })
      );
  }

  responseToProposalByToken(action: string, tpId: number, token: string) {
    return this.httpClient
      .post<boolean>(`${this.API_PATH}/` + action + 'ByToken',  null, {params: {tpId: tpId.toString(), token}})
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`ResponseToProposalByToken error: ${err.message}`);
        })
      );
  }

  responseToProposalById(action: string, tpId: number, studentId: string) {
    return this.httpClient
      .post<boolean>(`${this.API_PATH}/` + action + 'ById', null, {params: {tpId: tpId.toString(), studentId}})
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`ResponseToProposalById error: ${err.message}`);
        })
      );
  }
}
