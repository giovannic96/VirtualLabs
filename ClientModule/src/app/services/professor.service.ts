import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Professor} from '../models/professor.model';
import {Course} from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private API_PATH = 'http://localhost:9090/API/professors';

  constructor(private httpClient: HttpClient) { }

  allProfessors(): Observable<Professor[]> {
    return this.httpClient
      .get<Professor[]>(`${this.API_PATH}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAllProfessors error: ${err.message}`);
        })
      );
  }

  getCourses(professorId: string): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(`${this.API_PATH}/${professorId}/courses`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetCourses error: ${err.message}`);
        })
      );
  }

  professor(professorId: string): Observable<Professor> {
    return this.httpClient
      .get<Professor>(`${this.API_PATH}/${professorId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetProfessor error: ${err.message}`);
        })
      );
  }
}
