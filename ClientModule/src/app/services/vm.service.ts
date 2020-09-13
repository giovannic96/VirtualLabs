import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {VmModel} from '../models/vm-model.model';
import {Professor} from '../models/professor.model';
import {Router} from '@angular/router';
import {Vm} from '../models/vm.model';
import {Course} from '../models/course.model';
import {Team} from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class VmService {

  // private API_PATH = 'https://virtuallabs.ns0.it/API/vms';
  private API_PATH = 'http://localhost:8080/API/vms';

  private VM_MODEL_LOGO_URL = 'https://virtuallabs.ns0.it/images/vm_models/logo/';
  private VM_MODEL_LOGO_FORMAT = '.jpg';
  private VM_MODEL_PREVIEW_URL = 'https://virtuallabs.ns0.it/images/vm_models/preview/';
  private VM_MODEL_PREVIEW_FORMAT = '.jpg';

  constructor(private httpClient: HttpClient, private router: Router) { }

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

  getVmModelCourse(vmModelId: number) {
    return this.httpClient
      .get<Course>(`${this.API_PATH}/vmModels/${vmModelId}/course`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getVmModelCourse error: ${err.message}`);
        })
      );
  }

  deleteVmModel(vmModelId: number) {
    return this.httpClient
      .delete(`${this.API_PATH}/vmModels/${vmModelId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`deleteVmModel error: ${err.message}`);
        })
      );
  }

  getOsMap() {
    return this.httpClient
      .get(`${this.API_PATH}/vmModels/osMap`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getOsMap error: ${err.message}`);
        })
      );
  }

  getVmById(vmId: number) {
    return this.httpClient
      .get<Vm>(`${this.API_PATH}/${vmId}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getVm error: ${err.message}`);
        })
      );
  }

  getVmOwner(vmId: number) {
    return this.httpClient
      .get<Student>(`${this.API_PATH}/${vmId}/owner`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getVmOwner error: ${err.message}`);
        })
      );
  }

  getVmTeam(vmId: number) {
    return this.httpClient
      .get<Team>(`${this.API_PATH}/${vmId}/team`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getVmTeam error: ${err.message}`);
        })
      );
  }

  getVmModelByVmId(vmId: number) {
    return this.httpClient
      .get<VmModel>(`${this.API_PATH}/${vmId}/vmModel`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getVmModel error: ${err.message}`);
        })
      );
  }

  powerOnVm(vmId: number) {
    return this.httpClient
      .put(`${this.API_PATH}/${vmId}/powerOn`, null)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`powerOnVm error: ${err.message}`);
        })
      );
  }

  powerOffVm(vmId: number) {
    return this.httpClient
      .put(`${this.API_PATH}/${vmId}/powerOff`, null)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`powerOffVm error: ${err.message}`);
        })
      );
  }

  getVmModelOsPreviewUrl(osName: string): string {
    return this.VM_MODEL_PREVIEW_URL + osName + this.VM_MODEL_PREVIEW_FORMAT;
  }

  getVmModelOsLogoUrl(osName: string): string {
    return this.VM_MODEL_LOGO_URL + osName + this.VM_MODEL_LOGO_FORMAT;
  }

  encodeAndNavigate(vm: Vm) {
    const vmParam = btoa(JSON.stringify(vm));
    this.router.navigate(['virtual_desktop', vmParam]);
  }

  deleteVm(vmId: number) {
    return this.httpClient
      .delete<any>(`${this.API_PATH}/${vmId}`)
      .pipe(
        retry(3),
        catchError(err => {
          console.error(err);
          return throwError(`DeleteVm error: ${err.message}`);
        })
      );
  }
}
