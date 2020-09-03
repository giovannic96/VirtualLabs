import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Vm} from '../models/vm.model';
import {TeamProposal} from '../models/team-proposal.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private API_PATH = 'https://virtuallabs.ns0.it/API/teams';
  // private API_PATH = 'http://localhost:8080/API/teams';

  constructor(private httpClient: HttpClient) { }

  getTeamProposal(teamProposalId: number) {
    return this.httpClient
      .get<TeamProposal>(`${this.API_PATH}/teamProposals/${teamProposalId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getTeamProposal error: ${err.message}`);
        })
      );
  }

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

  proposeTeam(teamName: string, courseName: string, studentIds: string[]) {
    return this.httpClient
      .post<number>(`${this.API_PATH}/addTeamProposal`, {teamName, courseName, studentIds})
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`ProposeTeam error: ${err.message}`);
        })
      );
  }

  deleteTeam(teamId: number) {
    return this.httpClient
      .delete<any>(`${this.API_PATH}/${teamId}`)
      .pipe(
        retry(3),
        catchError(err => {
          console.error(err);
          return throwError(`DeleteTeam error: ${err.message}`);
        })
      );
  }
}
