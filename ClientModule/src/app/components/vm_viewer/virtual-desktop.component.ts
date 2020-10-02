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
import {MatDialog} from '@angular/material/dialog';
import {VmInfoDialogComponent} from './vm-info-dialog.component';
import {MyDialogComponent} from '../../helpers/dialog/my-dialog.component';
import Utility from '../../helpers/utility';
import {TeamService} from '../../services/team.service';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-virtual-desktop',
  templateUrl: './virtual-desktop.component.html',
  styleUrls: ['./virtual-desktop.component.css']
})
export class VirtualDesktopComponent implements OnInit {
  public loadComplete: boolean;
  public vmParams: any;
  public currentVm: Vm;
  public vmNotValid: boolean;
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

  public utility: Utility;

  constructor(public authService: AuthService,
              private courseService: CourseService,
              private vmService: VmService,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {

    this.authService.getUserInfo().subscribe(me => {
      this.authService.setUserLogged(me);
    });

    this.utility = new Utility();

    const loadingTimer = timer(3500);
    loadingTimer.subscribe(() => this.loadComplete = true);

    this.chosenTip = this.chooseRandomTip();

    this.courseService.hideMenu.next(true);
    this.courseService.hideMenuIcon.next(true);

    try {
      this.vmParams = JSON.parse(atob(this.route.snapshot.url.pop().path));
    } catch (e) {
      this.vmNotValid = true;
      alert('An error occurred while loading the virtual machine.\nTry again opening it from your personal page.');
      this.router.navigate(['courses']);
    }
    if (this.vmNotValid) return;

    const requests: Observable<any>[] = [];
    const vmId = this.vmParams.vmId;
    requests.push(
      this.vmService.getVmOwner(vmId),
      this.vmService.getVmTeam(vmId),
      this.vmService.getVmModelByVmId(vmId));

    forkJoin(requests).pipe(
      concatMap(responses => {
        this.vmOwner = responses[0];
        this.vmTeam = responses[1];
        this.vmModel = responses[2];
        return this.vmService.getVmById(vmId);
      }),
      concatMap( vm => {
        this.currentVm = vm;
        return this.vmService.getVmModelCourse(this.vmModel.id);
      })).subscribe(course => {
        this.vmCourse = course;
        const authUsers = this.authService.isProfessor() ?
          this.courseService.getProfessors(this.vmCourse.name) :
          this.teamService.getTeamMembers(this.vmTeam.id);

        authUsers.subscribe((users: User[]) => {
          const userFound = users.find(user => user.id === this.authService.getMyId());
          if (!userFound) {
            alert('You are unauthorized to access this virtual machine!');
            this.router.navigate(['courses']);
          }
          else if (!this.currentVm.active) {
            alert('You cannot access this virtual machine now.\n' +
              'Maybe it\'s turned off.\n' +
              'Check on your personal page or ask the owner to power it on.');
            this.router.navigate(['courses']);
          }
        });
    });

    this.stats = {cpu: 0, ram: 0, disk: 0};
    const statsTimer = timer(1000, 1000);

    statsTimer.subscribe(() => {
      this.stats.cpu = this.utility.getRandom(10, 50);
      this.stats.ram = this.utility.getRandom(10, 50);
      this.stats.disk = this.utility.getRandom(10, 50);
    });
  }

  ngOnInit(): void {}

  chooseRandomTip(): string {
    return this.tips[this.utility.getRandom(0, this.tips.length - 1)];
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
