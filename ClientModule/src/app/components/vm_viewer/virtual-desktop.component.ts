import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {VmService} from '../../services/vm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Vm} from '../../models/vm.model';
import {Student} from '../../models/student.model';
import {VmModel} from '../../models/vm-model.model';
import {Team} from '../../models/team.model';
import {Course} from '../../models/course.model';
import {EMPTY, forkJoin, Observable, of, Subscription, timer} from 'rxjs';
import {catchError, concatMap, mergeMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {VmInfoDialogComponent} from '../../helpers/dialog/vm-info-dialog.component';
import {AreYouSureDialogComponent} from '../../helpers/dialog/are-you-sure-dialog.component';
import Utility from '../../helpers/utility';
import {TeamService} from '../../services/team.service';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-virtual-desktop',
  templateUrl: './virtual-desktop.component.html',
  styleUrls: ['./virtual-desktop.component.css']
})
export class VirtualDesktopComponent implements OnInit, OnDestroy {
  public loadComplete: boolean;
  public vmParams: any;
  public currentVm: Vm;
  public vmNotValid: boolean;
  private vmCreator: Student;
  private vmTeam: Team;
  private vmModel: VmModel;
  private vmCourse: Course;
  public stats: any;

  @ViewChild('menu') menu: ElementRef<HTMLDivElement>;

  private tips: string[] = [
    'Hover on the thin bar on top to open menu',
    'Press F11 on your keyboard to go fullscreen. Press it again to exit fullscreen mode',
    'Click the info button on menu to view all the vm settings',
    'Remember to power off the virtual machine when you and your team have finished your work',
    'Be careful to not exceed the available resources'
  ];
  public chosenTip: string;

  private subscriptions: Subscription;
  public utility: Utility;

  constructor(public authService: AuthService,
              private courseService: CourseService,
              private vmService: VmService,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {

    this.subscriptions = new Subscription();
    this.utility = new Utility();

    this.subscriptions.add(
      this.authService.getUserInfo().subscribe(me => {
        this.authService.setUserLogged(me);
      }));

    const loadingTimer = timer(3500);
    this.subscriptions.add(
      loadingTimer.subscribe(() => {
        this.menu.nativeElement.focus();
        this.loadComplete = true;
      }));

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
      this.vmService.getVmCreator(vmId),
      this.vmService.getVmTeam(vmId),
      this.vmService.getVmModelByVmId(vmId));

    this.subscriptions.add(
      forkJoin(requests).pipe(
        catchError(err => {
          alert('Access denied!\nYou cannot use this virtual machine');
          this.router.navigate(['home']);
          return EMPTY;
        }),
        concatMap(responses => {
          this.vmCreator = responses[0];
          this.vmTeam = responses[1];
          this.vmModel = responses[2];
          return this.vmService.getVmById(vmId);
        }),
        concatMap( vm => {
          this.currentVm = vm;
          return this.vmService.getVmModelCourse(this.vmModel.id);
        }),
        mergeMap(course => {
          this.vmCourse = course;
          return this.authService.isProfessor() ?
            this.courseService.getProfessors(this.vmCourse.name) :
            this.teamService.getTeamMembers(this.vmTeam.id);
        }),
        concatMap((users: User[]) => {
          const userFound = users.find(user => user.id === this.authService.getMyId());
          if (!userFound) {
            alert('You are unauthorized to access this virtual machine!');
            this.router.navigate(['courses']);
          }
          else if (!this.currentVm.active) {
            alert('You cannot access this virtual machine now.\n' +
              'Maybe it\'s off.\n' +
              'Check on your personal page or ask an owner to power it on.');
            this.router.navigate(['courses']);
          }
          return this.vmService.heartbeat(this.currentVm.id);
        }))
        .subscribe(() => {
          alert('Sorry but this vm was powered off.\n' +
            'Please power it on from your personal page or ask one of the owners to do it for you.');
        }, error => {
          alert('An error occurred.\n' +
            'Maybe the vm was deleted while you are working on it or the vm server is temporarily out of service.\n' +
            'Please check on your personal page.');
        }, () => {
          this.router.navigate(['courses', this.vmCourse.name, 'vms']);
        })
    );

    this.stats = {cpu: 0, ram: 0, disk: 0};
    const statsTimer = timer(1000, 1000);

    this.subscriptions.add(
      statsTimer.subscribe(() => {
        this.stats.cpu = this.utility.getRandom(10, 50);
        this.stats.ram = this.utility.getRandom(10, 50);
        this.stats.disk = this.utility.getRandom(10, 50);
      }));
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  chooseRandomTip(): string {
    return this.tips[this.utility.getRandom(0, this.tips.length - 1)];
  }

  async backToCourses() {
    const message = 'You will be redirect to the course page';

    const areYouSure = await this.dialog.open(AreYouSureDialogComponent, {disableClose: true, data: {
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
      vmCreator: this.vmCreator,
      vmTeam: this.vmTeam,
      vmCourse: this.vmCourse};

    this.dialog.open(VmInfoDialogComponent, {data});
  }

}
