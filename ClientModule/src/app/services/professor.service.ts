import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Professor} from '../models/professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  // private API_PATH = 'https://virtuallabs.ns0.it/API/professors';
  private API_PATH = 'http://localhost:8080/API/professors';

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
