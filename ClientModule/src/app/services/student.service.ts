import { Injectable } from '@angular/core';
import {Student} from '../models/student.model';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_PATH = 'http://localhost:8080/API/students';

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
}
