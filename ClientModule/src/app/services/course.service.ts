import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {Student} from "../models/student.model";
import {catchError, retry} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private API_PATH = 'http://localhost:8080/API/courses';

  constructor(private httpClient: HttpClient) { }

  getEnrolled(courseName: string) : Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${courseName}/enrolled`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetEnrolled error: ${err.message}`);
        })
      );
  }

  getNotEnrolled(courseName: string) : Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${courseName}/notEnrolled`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetEnrolled error: ${err.message}`);
        })
      );
  }

  enroll(student: Student) : Observable<Student> {
    return null;
  }

  unroll(student: Student[]) : Observable<Student[]> {
    return null;
  }

  /*
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
   */
}
