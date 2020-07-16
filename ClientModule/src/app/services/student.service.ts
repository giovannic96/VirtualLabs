import { Injectable } from '@angular/core';
import {Student} from "../student.model";
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {catchError, retry} from "rxjs/operators";

let DATA_SOURCE: Student[] = [
  {id: '123456', name: 'Rossi', firstName: 'Mario', courseId: 1},
  {id: '538746', name: 'Russo', firstName: 'Leonardo', courseId: 1},
  {id: '135275', name: 'Ferrari', firstName: 'Francesco', courseId: 0},
  {id: '132353', name: 'Esposito', firstName: 'Alessandro', courseId: 0},
  {id: '123125', name: 'Bianchi', firstName: 'Lorenzo', courseId: 1},
  {id: '123113', name: 'Romano', firstName: 'Mattia', courseId: 0},
  {id: '353252', name: 'Colombo', firstName: 'Andrea', courseId: 0},
  {id: '352324', name: 'Ricci', firstName: 'Gabriele', courseId: 1},
  {id: '544456', name: 'Marino', firstName: 'Edoardo', courseId: 0},
  {id: '532456', name: 'Greco', firstName: 'Tommaso', courseId: 1}
];

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_PATH = 'https://localhost:4200/api/students';

  constructor(private httpClient: HttpClient) { }

  create(newStudent: Student) : Observable<Student> {
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

  update(newStudent: Student) : Observable<Student> {
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

  query(): Observable<Student[]> {
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

  delete(studentId: string) : Observable<Student> {
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

  getEnrolled() : Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}?courseId=1`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetEnrolled error: ${err.message}`);
        })
    );
  }

  enroll(student: Student) : Observable<Student> {
    student.courseId = 1;
    return this.update(student);
  }

  unroll(student: Student[]) : Observable<Student[]> {
    return forkJoin(student
      .map(s => {
        s.courseId = 0;
        return <Observable<Student>>this.update(s);
    }));
  }
}
