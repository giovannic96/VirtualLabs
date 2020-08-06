import { Component, OnInit } from '@angular/core';
import {VmService} from '../../../services/vm.service';
import {TeamService} from '../../../services/team.service';
import {CourseService} from '../../../services/course.service';
import {catchError, concatAll, concatMap, filter, map, mergeAll, mergeMap, tap, toArray} from 'rxjs/operators';
import {forkJoin, Observable, of} from 'rxjs';
import {Course} from '../../../models/course.model';
import {Team} from '../../../models/team.model';
import {Vm} from '../../../models/vm.model';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../auth/login-dialog.component';
import {VmModelSettingsDialogComponent} from './vm-model-settings-dialog.component';
import {VmModel} from '../../../models/vm-model.model';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';

@Component({
  selector: 'app-vm',
  templateUrl: './vm.component.html',
  styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

  private currentCourse: Observable<Course>;

  public vmModel: VmModel;
  public teamList: Team[];

  constructor(private vmService: VmService,
              private teamService: TeamService,
              private courseService: CourseService,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));

    this.currentCourse.pipe(
      concatMap(course => this.courseService.getAllTeams(course.name)),
      concatMap(teamList => {
        this.teamList = teamList;
        return teamList;
      }),
      mergeMap(team => {
        this.teamService.getTeamVms(team.id).subscribe(vms => team.vms = vms);
        return of(null);
      })).subscribe();

    this.currentCourse.pipe(
      concatMap(course => this.courseService.getVmModel(course.name)),
      concatMap(vmModel => {
        this.vmModel = vmModel;
        return this.vmService.getVmModelProfessor(vmModel.id);
      })).subscribe(professor => this.vmModel.professor = professor,
      error => this.vmModel = null);

  }

  ngOnInit(): void {
  }

  openDialog(action: string) {
    // TODO: usare 'action' per dire al dialog se creare o modificare il model

    const dialogRef = this.dialog.open(VmModelSettingsDialogComponent, {disableClose: true});

    let course: Course;
    const subscription = this.currentCourse.subscribe(currentCourse => course = currentCourse);

    dialogRef.afterClosed().pipe(concatMap((vmModel: VmModel) => {
      if (!!vmModel) {
        return this.courseService.setVmModel(course.name, vmModel.getDTO());
      }
    })).subscribe(response => this.mySnackBar.openSnackBar('Vm model created successfully', MessageType.SUCCESS, 3),
      error => this.mySnackBar.openSnackBar('Vm model creation failed', MessageType.ERROR, 3));

    subscription.unsubscribe();
  }

  calcDiskLabel(value: number) {
    if (value < 1024)
      return value + ' GB';
    else if (value % 1024)
      return (value / 1024).toFixed(1) + ' TB';
    else
      return (value / 1024) + ' TB';
  }
}
