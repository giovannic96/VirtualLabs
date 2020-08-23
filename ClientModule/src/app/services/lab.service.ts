import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {Report} from '../models/report.model';
import {Version} from '../models/version.model';

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

  getReportVersions(reportId: number) {
    return this.httpClient
      .get<Version[]>(`${this.API_PATH}/reports/${reportId}/versions`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetReportVersions error: ${err.message}`);
        })
      );
  }

  getReportOwner(reportId: number) {
    return this.httpClient
      .get<Student>(`${this.API_PATH}/reports/${reportId}/owner`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetReportOwner error: ${err.message}`);
        })
      );
  }
}
