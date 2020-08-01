import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Team} from '../models/team.model';
import {Vm} from '../models/vm.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private API_PATH = 'https://virtuallabs.ns0.it/API/teams';

  constructor(private httpClient: HttpClient) { }

  getTeamMembers(teamId: number) {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${teamId}/members`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetMembers error: ${err.message}`);
        })
      );
  }

  getTeamProposalMembers(teamProposalId: number) {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/teamProposals/${teamProposalId}/members`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetTeamProposalMembers error: ${err.message}`);
        })
      );
  }

  getTeamProposalCreator(teamProposalId: number) {
    return this.httpClient
      .get<Student>(`${this.API_PATH}/teamProposals/${teamProposalId}/creator`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetTeamProposalCreator error: ${err.message}`);
        })
      );
  }

  getTeamVms(teamId: number) {
    return this.httpClient
      .get<Vm[]>(`${this.API_PATH}/${teamId}/vms`)
      .pipe(
        retry(3),
        catchError(err => {
          console.error(err);
          return throwError(`GetVms error: ${err.message}`);
        })
      );
  }
}
