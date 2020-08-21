import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from "../models/student.model";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {Report} from "../models/report.model";

@Injectable({
  providedIn: 'root'
})
export class LabService {

  // private API_PATH = 'https://virtuallabs.ns0.it/API/labs';
  private API_PATH = 'http://localhost:8080/API/labs';

  constructor(private httpClient: HttpClient) { }

  getAssignmentReports(assignmentId: number) {
    return this.httpClient
      .get<Report[]>(`${this.API_PATH}/assignments/${assignmentId}/reports`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAssignmentReports error: ${err.message}`);
        })
      );
  }
}
