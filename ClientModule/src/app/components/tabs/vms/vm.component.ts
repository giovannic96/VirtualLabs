import {Component, OnInit} from '@angular/core';
import {VmService} from '../../../services/vm.service';
import {TeamService} from '../../../services/team.service';
import {CourseService} from '../../../services/course.service';
import {concatMap, filter, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Course} from '../../../models/course.model';
import {Team} from '../../../models/team.model';
import {MatDialog} from '@angular/material/dialog';
import {VmModelSettingsDialogComponent} from './vm-model-settings-dialog.component';
import {VmModel} from '../../../models/vm-model.model';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {MyDialogComponent} from '../../../helpers/my-dialog.component';

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
        console.log(vmModel);
        this.vmModel = vmModel;
        return this.vmService.getVmModelProfessor(vmModel.id);
      })).subscribe(professor => this.vmModel.professor = professor,
      error => {
        if (this.vmModel)
          this.vmModel.professor = null;
      });

  }

  ngOnInit(): void {
  }

  async openDialog() {

    const data = {modelExists: false, vmModel: this.vmModel};
    if (this.vmModel) {
      data.modelExists = true;
    }

    const dialogRef = this.dialog.open(VmModelSettingsDialogComponent, {disableClose: true, data});

    const course: Course = this.courseService.getSelectedCourseValue();

    const dialogResponse: VmModel = await dialogRef.afterClosed().toPromise();
    if (!!dialogResponse) {
      let successMessage: string;
      let errorMessage: string;
      let vmModelRequest: Observable<boolean>;
      if (this.vmModel) {
        successMessage = 'Vm model edited successfully';
        errorMessage = 'Vm model editing failed';
        vmModelRequest = this.courseService.editVmModel(course.name, dialogResponse.getDTO());
      } else {
        successMessage = 'Vm model created successfully';
        errorMessage = 'Vm model creation failed';
        vmModelRequest = this.courseService.setVmModel(course.name, dialogResponse.getDTO());
      }

      vmModelRequest.pipe(concatMap(() => this.courseService.getVmModel(course.name)))
      .subscribe(vmModel => {
        // TODO: appena funziona il login usare il current user per settare il professore che ha fatto la modifica o l'inserimento
        this.vmModel = vmModel;
        this.mySnackBar.openSnackBar(successMessage, MessageType.SUCCESS, 3);
      }, error => this.mySnackBar.openSnackBar(errorMessage, MessageType.ERROR, 3));
    }
  }

  calcDiskLabel(value: number) {
    if (value < 1024)
      return value + ' GB';
    else if (value % 1024)
      return (value / 1024).toFixed(1) + ' TB';
    else
      return (value / 1024) + ' TB';
  }

  async deleteVmModel() {
    if (this.vmModel) {
      const areYouSure: Promise<boolean> = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
          message: 'Warning! Deleting a vm model you will delete also ALL vms related to it'
        }}).afterClosed().toPromise();

      if (areYouSure) {
        this.vmService.deleteVmModel(this.vmModel.id).subscribe(
          () => {
            this.vmModel = null;
            this.teamList.forEach(team => team.vms = []);
            this.mySnackBar.openSnackBar('Vm model deleted successfully', MessageType.SUCCESS, 3);
          },
          error => this.mySnackBar.openSnackBar('Vm model deletion failed', MessageType.ERROR, 3)
        );
      }
    }
  }
}
