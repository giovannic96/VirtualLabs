import { Injectable } from '@angular/core';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, retry} from 'rxjs/operators';
import {Team} from '../models/team.model';
import {Course} from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_PATH = 'http://localhost:9090/API/students';

  constructor(private httpClient: HttpClient) { }

  find(studentId: string): Observable<Student> {
    return this.httpClient
      .get<Student>(`${this.API_PATH}/${studentId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`Find error: ${err.message}`);
        })
      );
  }

  getAll(): Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`Query error: ${err.message}`);
        })
      );
  }

  getCourses(studentId: string): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(`${this.API_PATH}/${studentId}/courses`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetCourses error: ${err.message}`);
        })
      );
  }

  getTeamForStudent(studentId: string, courseName: string) {
    return this.httpClient
      .get<Team>(`${this.API_PATH}/${studentId}/courses/${courseName}/team`)
      .pipe(
        retry(3),
        catchError(err => {
          console.error(err);
          return throwError(`GetTeamForStudent error: ${err.message}`);
        })
      );
  }

  checkAcceptedProposals(studentId: string, courseName: string) {
    return this.httpClient
      .get<boolean>(`${this.API_PATH}/${studentId}/courses/${courseName}/checkAcceptedProposals`)
      .pipe(
        retry(3),
        catchError(err => {
          console.error(err);
          return throwError(`CheckAcceptedProposal error: ${err.message}`);
        })
      );
  }

  checkProposalResponse(studentId: string, tpId: number) {
    return this.httpClient
      .get<boolean>(`${this.API_PATH}/${studentId}/teamProposals/${tpId}/checkResponse`)
      .pipe(
        retry(3),
        catchError(err => {
          console.error(err);
          return throwError(`checkProposalResponse error: ${err.message}`);
        })
      );
  }
}
