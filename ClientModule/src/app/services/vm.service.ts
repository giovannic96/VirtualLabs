import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {VmModel} from '../models/vm-model.model';
import {Professor} from '../models/professor.model';

@Injectable({
  providedIn: 'root'
})
export class VmService {

  // private API_PATH = 'https://virtuallabs.ns0.it/API/vms';
  private API_PATH = 'http://localhost:8080/API/vms';

  constructor(private httpClient: HttpClient) { }

  getVmModelProfessor(vmModelId: number): Observable<Professor> {
    return this.httpClient
      .get<Professor>(`${this.API_PATH}/vmModels/${vmModelId}/professor`)
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`getVmModelProfessor error: ${err.message}`);
        })
      );
  }

}
