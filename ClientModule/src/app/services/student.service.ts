import { Injectable } from '@angular/core';
import {Student} from '../models/student.model';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, retry} from 'rxjs/operators';
import {Team} from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_PATH = 'https://virtuallabs.ns0.it/API/students';

  constructor(private httpClient: HttpClient) { }

  create(newStudent: Student): Observable<Student> {
    return this.httpClient
      .post<Student>(`${this.API_PATH}`, newStudent)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`Create error: ${err.message}`);
        })
      );
  }

  update(newStudent: Student): Observable<Student> {
    return this.httpClient
      .put<Student>(`${this.API_PATH}/${newStudent.id}`, newStudent)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`Update error: ${err.message}`);
        })
      );
  }

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

  delete(studentId: string): Observable<Student> {
    return this.httpClient
      .delete<Student>(`${this.API_PATH}/${studentId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`Delete error: ${err.message}`);
        })
      );
  }

  getCourses(studentId: string): Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${studentId}/courses`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetCourses error: ${err.message}`);
        })
      );
  }

  getTeams(studentId: string): Observable<Team[]> {
    return this.httpClient
      .get<Team[]>(`${this.API_PATH}/${studentId}/teams`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetTeams error: ${err.message}`);
        })
      );
  }

}
