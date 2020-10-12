import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Report} from '../models/report.model';
import {Version} from '../models/version.model';
import {Assignment} from '../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  private API_PATH = 'http://localhost:9090/API/labs';

  constructor(private httpClient: HttpClient) { }

  getAssignment(assignmentId: number) {
    return this.httpClient
      .get<Assignment>(`${this.API_PATH}/assignments/${assignmentId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getAssignment error: ${err.message}`);
        })
      );
  }

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

  getAssignmentReportForStudent(assignmentId: number) {
    return this.httpClient
      .get<Report>(`${this.API_PATH}/assignments/${assignmentId}/studentReport`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAssignmentReportForStudent error: ${err.message}`);
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

  submitVersionOnReport(reportId: number, formData: FormData) {
    return this.httpClient
      .post(`${this.API_PATH}/reports/${reportId}/submitVersion`, formData, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`SubmitVersion error: ${err.message}`);
        })
      );
  }

  submitReviewOnVersion(versionId: number, imageUrl: string) {
    return this.httpClient
      .post(`${this.API_PATH}/versions/${versionId}/review`, imageUrl)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`SubmitReview error: ${err.message}`);
        })
      );
  }

  editAssignment(assignmentId: number, assignment: Assignment) {
    return this.httpClient
      .put<boolean>(`${this.API_PATH}/assignments/${assignmentId}`, assignment)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`editAssignment error: ${err.message}`);
        })
      );
  }

  deleteAssignment(assignmentId: number) {
    return this.httpClient
      .delete(`${this.API_PATH}/assignments/${assignmentId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`deleteAssignment error: ${err.message}`);
        })
      );
  }

  gradeReport(reportId: number, data: any) {
    return this.httpClient
      .put(`${this.API_PATH}/reports/${reportId}/gradeReport`, data)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  markReportAsRead(reportId: number) {
    return this.httpClient
      .put(`${this.API_PATH}/reports/${reportId}/markAsRead`, null)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`MarkAsRead error: ${err.message}`);
        })
      );
  }
}
