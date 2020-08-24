import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../services/course.service';
import {VmService} from '../../services/vm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Vm} from '../../models/vm.model';
import {Student} from '../../models/student.model';
import {VmModel} from '../../models/vm-model.model';
import {Team} from '../../models/team.model';
import {Course} from '../../models/course.model';
import {forkJoin, Observable, timer} from 'rxjs';
import {concatMap} from 'rxjs/operators';
import {VmModelSettingsDialogComponent} from '../tabs/vms/vm-model-settings-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {VmInfoDialogComponent} from './vm-info-dialog.component';
import {MyDialogComponent} from '../../helpers/my-dialog.component';

@Component({
  selector: 'app-virtual-desktop',
  templateUrl: './virtual-desktop.component.html',
  styleUrls: ['./virtual-desktop.component.css']
})
export class VirtualDesktopComponent implements OnInit {
  public loadComplete: boolean;
  public currentVm: Vm;
  private vmOwner: Student;
  private vmTeam: Team;
  private vmModel: VmModel;
  private vmCourse: Course;
  public stats: any;

  private tips: string[] = [
    'Hover on the thin bar on top to open menu',
    'Press F11 on your keyboard to go fullscreen. Press it again to exit fullscreen mode',
    'Click the info button on menu to view all the vm settings',
    'This is just another fake tip cause i have no imagination'
  ];
  public chosenTip: string;

  constructor(private courseService: CourseService,
              private vmService: VmService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog)
  {
    const loadingTimer = timer(5000);
    loadingTimer.subscribe(() => this.loadComplete = true);

    this.chosenTip = this.chooseRandomTip();

    this.courseService.hideMenu.next(true);
    this.courseService.hideMenuIcon.next(true);

    this.currentVm = JSON.parse(atob(this.route.snapshot.url.pop().path));

    const requests: Observable<any>[] = [];
    requests.push(
      this.vmService.getVmOwner(this.currentVm.id),
      this.vmService.getVmTeam(this.currentVm.id),
      this.vmService.getVmModelByVmId(this.currentVm.id));

    forkJoin(requests).pipe(
      concatMap(responses => {
        this.vmOwner = responses[0];
        this.vmTeam = responses[1];
        this.vmModel = responses[2];
        return this.vmService.getVmModelCourse(this.vmModel.id);
      })).subscribe(course => this.vmCourse = course);

    this. stats = {cpu: 0, ram: 0, disk: 0};
    const statsTimer = timer(1000, 1000);

    statsTimer.subscribe(() => {
      this.stats.cpu = this.getRandom(10, 50);
      this.stats.ram = this.getRandom(10, 50);
      this.stats.disk = this.getRandom(10, 50);
    });
  }

  ngOnInit(): void {}

  chooseRandomTip(): string {
    return this.tips[this.getRandom(0, this.tips.length - 1)];
  }

  async backToCourses() {
    const message = 'You will be redirect to the course page';

    const areYouSure = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
        message,
        buttonConfirmLabel: 'CONFIRM',
        buttonCancelLabel: 'CANCEL'
      }
    }).afterClosed().toPromise();

    if (areYouSure) {
      this.router.navigate(['courses', this.vmCourse.name, 'vms']);
    }
  }

  public getRandom(from: number, to: number): number {
    return Math.floor(Math.random() * (to + 1)) + from;
  }

  openInfoDialog() {

    const data: any = {
      vm: this.currentVm,
      vmModel: this.vmModel,
      vmOwner: this.vmOwner,
      vmTeam: this.vmTeam,
      vmCourse: this.vmCourse};

    const dialogRef = this.dialog.open(VmInfoDialogComponent, {data});

  }

}
