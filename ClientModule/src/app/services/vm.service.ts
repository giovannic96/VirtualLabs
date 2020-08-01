import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VmService {

  private API_PATH = 'https://virtuallabs.ns0.it/API/vms';

  constructor(private httpClient: HttpClient) { }

}
