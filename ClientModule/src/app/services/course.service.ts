import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {Student} from '../models/student.model';
import {catchError, map, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Course} from '../models/course.model';
import {Team} from '../models/team.model';
import {TeamProposal} from '../models/team-proposal.model';
import {VmModel} from '../models/vm-model.model';
import {Professor} from '../models/professor.model';
import {Assignment} from "../models/assignment.model";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // private API_PATH = 'https://virtuallabs.ns0.it/API/courses';
  private API_PATH = 'http://localhost:8080/API/courses';

  private _selectedCourse: BehaviorSubject<Course>;
  public clicksOnMenu: Subject<Event>;
  public hideMenuIcon: Subject<boolean>;

  constructor(private httpClient: HttpClient) {
    this._selectedCourse = new BehaviorSubject<Course>(null);
    this.clicksOnMenu = new Subject<Event>();
    this.hideMenuIcon = new Subject<boolean>();
  }

  getSelectedCourse(): Observable<Course> {
    return this._selectedCourse.asObservable();
  }

  setSelectedCourse(course: Course) {
    this._selectedCourse.next(course);
  }

  getSelectedCourseValue(): Course {
    return this._selectedCourse.getValue();
  }

  getAll(): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(`${this.API_PATH}`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAll error: ${err.message}`);
        })
      );
  }

  getEnrolled(courseName: string): Observable<Student[]> {
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

  getNotEnrolled(courseName: string): Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${courseName}/notEnrolled`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetNotEnrolled error: ${err.message}`);
        })
      );
  }

  enroll(courseName: string, studentId: string) {
    return this.httpClient
      .post<any>(`${this.API_PATH}/${courseName}/enrollOne`, {id: studentId})
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`EnrollOne error: ${err.message}`);
        })
      );
  }

  unroll(courseName: string, studentIds: string[]) {
    return this.httpClient
      .post<any>(`${this.API_PATH}/${courseName}/unrollMany`, studentIds)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`UnrollMany error: ${err.message}`);
        })
      );
  }

  getAllAssignments(courseName: string): Observable<Assignment[]> {
    return this.httpClient
      .get<Assignment[]>(`${this.API_PATH}/${courseName}/assignments`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAllAssignments error: ${err.message}`);
        })
      );
  }

  getAllTeams(courseName: string): Observable<Team[]> {
    return this.httpClient
      .get<Team[]>(`${this.API_PATH}/${courseName}/teams`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAllTeams error: ${err.message}`);
        })
      );
  }

  getAllProposals(courseName: string): Observable<TeamProposal[]> {
    return this.httpClient
      .get<TeamProposal[]>(`${this.API_PATH}/${courseName}/teamProposals`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetAllProposals error: ${err.message}`);
        })
      )
      .pipe(map(teamProposal => {
        teamProposal.forEach(proposal => proposal.expiryDate = new Date(proposal.expiryDate));
        return teamProposal;
      }));
  }

  getTeamedUpStudents(courseName: string): Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${courseName}/teamedUp`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getTeamedUp error: ${err.message}`);
        })
      );
  }

  getNotTeamedUpStudents(courseName: string): Observable<Student[]> {
    return this.httpClient
      .get<Student[]>(`${this.API_PATH}/${courseName}/notTeamedUp`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getNotTeamedUp error: ${err.message}`);
        })
      );
  }

  getVmModel(courseName: string): Observable<VmModel> {
    return this.httpClient
      .get<VmModel>(`${this.API_PATH}/${courseName}/vmModel`)
      .pipe(
        retry(1),
        catchError( err => {
          console.error(err);
          return throwError(`getVmModel error: ${err.message}`);
        })
      );
  }

  setVmModel(courseName: string, vmModel: VmModel) {
    return this.httpClient
      .post<boolean>(`${this.API_PATH}/${courseName}/setVmModel`, vmModel)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`setVmModel error: ${err.message}`);
        })
      );
  }

  getProfessors(courseName: string): Observable<Professor[]> {
    return this.httpClient
      .get<Professor[]>(`${this.API_PATH}/${courseName}/professors`)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`getProfessors error: ${err.message}`);
        })
      );
  }

  editVmModel(courseName: string, vmModel: VmModel) {
    return this.httpClient
      .put<boolean>(`${this.API_PATH}/${courseName}/editVmModel`, vmModel)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`editVmModel error: ${err.message}`);
        })
      );
  }

  getResource(link: string) {
    return this.httpClient
      .get<any>(link)
      .pipe(
        retry(3),
        catchError( err => {
          console.error(err);
          return throwError(`GetResource error: ${err.message}`);
        })
      );
  }
}
