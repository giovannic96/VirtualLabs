import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // private API_PATH = 'https://virtuallabs.ns0.it/notification';
  private API_PATH = 'http://localhost:9090/notification';

  constructor(private httpClient: HttpClient) { }

  responseToProposalByToken(action: string, tpId: number, token: string) {
    return this.httpClient
      .post<boolean>(`${this.API_PATH}/` + action,  null, {params: {tpId: tpId.toString(), token}})
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`ResponseToProposalByToken error: ${err.message}`);
        })
      );
  }

  responseToProposal(action: string, tpId: number) {
    return this.httpClient
      .post<boolean>(`${this.API_PATH}/protected/` + action, null, {params: {tpId: tpId.toString()}})
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`ResponseToProposal error: ${err.message}`);
        })
      );
  }
}
