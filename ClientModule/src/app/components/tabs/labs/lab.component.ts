import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Assignment} from '../../../models/assignment.model';
import {concatMap, filter, mergeMap, tap} from 'rxjs/operators';
import {CourseService} from '../../../services/course.service';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {Course} from '../../../models/course.model';
import {LabService} from '../../../services/lab.service';
import {Report, ReportStatus} from '../../../models/report.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VersionDialogComponent} from '../../../helpers/dialog/version-dialog.component';
import {GradeDialogComponent} from '../../../helpers/dialog/grade-dialog.component';
import {ThemePalette} from '@angular/material/core';
import {Student} from '../../../models/student.model';
import {Version} from '../../../models/version.model';
import {NotificationService} from '../../../services/notification.service';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {AssignmentDialogComponent} from '../../../helpers/dialog/assignment-dialog.component';
import {StudentService} from '../../../services/student.service';
import {AreYouSureDialogComponent} from '../../../helpers/dialog/are-you-sure-dialog.component';
import {AddVersionDialogComponent} from '../../../helpers/dialog/add-version-dialog.component';
import Utility from '../../../helpers/utility';
import {AuthService} from '../../../services/auth.service';

export interface ReportStatusFilter {
  name: string;
  checked: boolean;
  color: ThemePalette;
}

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css', '../../../helpers/add-btn-round.css']
})
export class LabComponent implements OnInit, AfterViewInit, OnDestroy {

  private currentCourse: Observable<Course>;
  public assignmentList: Assignment[];
  public gridColumns = 3;
  public ReportStatus = ReportStatus;

  allReports: Map<number, Report[]>;
  filteredReports: Map<number, Report[]>;
  studentReports: Map<number, Report>;
  reportStatusFilter: ReportStatusFilter[];
  assignmentStatusMap: Map<number, {label: string, className: string}>;

  private subscriptions: Subscription;
  public utility: Utility;

  constructor(public authService: AuthService,
              private courseService: CourseService,
              private labService: LabService,
              private notificationService: NotificationService,
              private studentService: StudentService,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

    this.subscriptions = new Subscription();
    this.utility = new Utility();

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));
    this.allReports = new Map<number, Report[]>();
    this.filteredReports = new Map<number, Report[]>();
    this.studentReports = new Map<number, Report>();
    this.reportStatusFilter = [
      {name : ReportStatus.NULL, checked : true, color: undefined},
      {name : ReportStatus.READ, checked : true, color: 'primary'},
      {name : ReportStatus.SUBMITTED, checked : true, color: 'accent'},
      {name : ReportStatus.REVISED, checked : true, color: 'warn'},
      {name : ReportStatus.GRADED, checked : true, color: 'accent'},
    ];
    this.assignmentStatusMap = new Map<number, {label: string, className: string}>();

    let assignmentCounter: number;

    this.subscriptions.add(
      this.currentCourse.pipe(
        concatMap(course => this.courseService.getAllAssignments(course.name)),
        mergeMap(assignmentList => {
          this.assignmentList = assignmentList;
          assignmentCounter = assignmentList.length;
          return assignmentList;
        }),
        tap(assignment => {
          if (this.authService.isProfessor()) {
            this.labService.getAssignmentReports(assignment.id).pipe(
              mergeMap(reports => {

                // assign reports to the current assignment
                this.setReportsToAssignment(assignment, reports);

                const ownerRequests: Observable<Student>[] = [];
                const versionRequests: Observable<Version[]>[] = [];
                reports.forEach(report => {
                  ownerRequests.push(this.labService.getReportOwner(report.id));
                  versionRequests.push(this.labService.getReportVersions(report.id));
                });

                forkJoin(ownerRequests).subscribe(owners => {
                  // assign owner to each report
                  this.setOwnerToReports(reports, owners);

                  // update UI (only when all assignments have been processed)
                  assignmentCounter--;
                  if (!assignmentCounter) {
                    this.filterReports();
                    this.assignmentList.forEach(a => this.setAssignmentStatusLabel(a));
                  }
                });

                forkJoin(versionRequests).subscribe(versions => {
                  // assign version to each report
                  this.setVersionToReports(reports, versions);
                });

                return reports;
              })).subscribe();
          } else {
            this.labService.getAssignmentReportForStudent(assignment.id).pipe(
              mergeMap(report => {
                this.setReportsToAssignment(assignment, [report]);

                const versionRequests: Observable<Version[]>[] = [];
                versionRequests.push(this.labService.getReportVersions(report.id));

                forkJoin(versionRequests).subscribe(versions => {
                  this.setVersionToReports([report], versions);
                  this.assignmentList.forEach(a => this.setAssignmentStatusLabel(a));
                });

                return [report];
              })).subscribe();
          }
        })).subscribe());
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openVersionDialog(version: Version, report: Report, assignment: Assignment, isLast: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    const isRevisable = isLast && this.authService.isProfessor
                        && this.isAssignmentExpired(assignment)
                        && report.status === ReportStatus.SUBMITTED;

    dialogConfig.data = {
      version,
      isLast,
      isRevisable,
    };
    const dialogRef = this.dialog.open(VersionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) { // i.e. close button was pressed
          this.labService.submitReviewOnVersion(data.versionId, data.reviewImage).subscribe(() => {
            this.mySnackBar.openSnackBar('Review uploaded and email sent successfully', MessageType.SUCCESS, 3);
            this.labService.getReportVersions(report.id).subscribe(versions => {
                this.allReports.get(assignment.id).find(r => r.id === report.id).versions = versions;
                if (data.gradeAfter)
                  this.openGradeDialog(report);
            });
          }, err => {
            if (err.status === 503)
              this.mySnackBar.openSnackBar('Error while sending the email. Student may not have received the email correctly', MessageType.ERROR, 3);
            else
              this.mySnackBar.openSnackBar('Something gone wrong uploading review', MessageType.ERROR, 3);
          });
        }
      }
    );
  }

  openGradeDialog(report: Report) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      version: report.versions[report.versions.length - 1]
    };

    const dialogRef = this.dialog.open(GradeDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) { // i.e. close button was pressed
          this.labService.gradeReport(report.id, data).subscribe(() => {
            report.grade = data.grade;
            report.status = ReportStatus.GRADED;
            this.mySnackBar.openSnackBar('Report graded and email sent successfully', MessageType.SUCCESS, 3);
          }, err => {
            if (err.status === 503)
              this.mySnackBar.openSnackBar('Error while sending the email. Student may not have received the email correctly', MessageType.ERROR, 3);
            else
              this.mySnackBar.openSnackBar('Error while grading report', MessageType.ERROR, 3);
          });
        }
      }
    );
  }

  async openAssignmentDialog(assignment: Assignment = null, isEdit: boolean = false) {

    const data = {modelExists: isEdit, assignment};
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {disableClose: true, data});
    const course: Course = this.courseService.getSelectedCourseValue();
    let dialogResponse: Assignment = await dialogRef.afterClosed().toPromise();

    if (!!dialogResponse) {

      if (dialogResponse.name === '') {
        this.mySnackBar.openSnackBar('Assignment was not modified: data are the same', MessageType.WARNING, 3);
      }
      else {
        if (isEdit) {
          this.labService.editAssignment(assignment.id, dialogResponse.getDTO())
            .pipe(
              concatMap( () => this.labService.getAssignment(assignment.id))
            )
            .subscribe(asmnt => {
              // find selected assignment
              const a = this.assignmentList.find(el => el.id === asmnt.id);

              // edit selected assignment
              a.name = asmnt.name;
              a.content = asmnt.content;
              a.expiryDate = this.utility.localDateTimeToString(asmnt.expiryDate);
              this.mySnackBar.openSnackBar('Assignment edited successfully', MessageType.SUCCESS, 3);
            }, error => this.mySnackBar.openSnackBar('Assignment editing failed', MessageType.ERROR, 3));
        }
        else {
          this.courseService.addAssignment(course.name, dialogResponse.getDTO()).pipe(
            concatMap(newId => this.labService.getAssignment(newId)),
            concatMap(newAssignment => {
              newAssignment.expiryDate = this.utility.localDateTimeToString(newAssignment.expiryDate);
              newAssignment.releaseDate = this.utility.localDateTimeToString(newAssignment.releaseDate);
              dialogResponse = newAssignment;
              return this.labService.getAssignmentReports(newAssignment.id);
            }),
            mergeMap(reportList => {

              const ownerReqs: Observable<Student>[] = [];
              reportList.forEach(report => {
                report.versions = [];
                ownerReqs.push(this.labService.getReportOwner(report.id));
              });

              // assign reports to the inserted assignment
              this.setReportsToAssignment(dialogResponse, reportList);
              return forkJoin(ownerReqs);
            })
          ).subscribe(ownersList => {
            // assign owner to each report
            this.setOwnerToReports(dialogResponse.reports, ownersList);
            this.assignmentList.push(dialogResponse);

            // update UI
            this.filterReports();
            this.setAssignmentStatusLabel(dialogResponse);

            this.mySnackBar.openSnackBar('Assignment created successfully', MessageType.SUCCESS, 3);
          }, () => this.mySnackBar.openSnackBar('Assignment creation failed', MessageType.ERROR, 3));
        }
      }
    }
  }

  async deleteAssignment(assignmentId: number) {
    // Prepare the message
    const message = 'This will delete also all the reports and the versions related to this assignment';

    // Open a dialog and get the response as an 'await'
    const areYouSure = await this.dialog.open(AreYouSureDialogComponent, {disableClose: true, data: {
        message,
        buttonConfirmLabel: 'CONFIRM',
        buttonCancelLabel: 'CANCEL'
      }
    }).afterClosed().toPromise();

    // Check the response when dialog closes
    if (areYouSure) {
      this.labService.deleteAssignment(assignmentId).subscribe(() => {
        this.mySnackBar.openSnackBar('Assignment deleted successfully', MessageType.SUCCESS, 3);
        const index = this.assignmentList.findIndex(a => a.id === assignmentId);
        this.assignmentList.splice(index, 1);
      }, error => {
        this.mySnackBar.openSnackBar('Impossible to delete this assignment', MessageType.ERROR, 5);
      });
    }
  }

  async openAddVersionDialog(report: Report, assignment: Assignment) {

    const data = report;
    const dialogRef = this.dialog.open(AddVersionDialogComponent, {disableClose: true, data});
    const dialogResponse: any = await dialogRef.afterClosed().toPromise();

    if (dialogResponse !== undefined) {
      if (!!dialogResponse) {
        this.labService.getReportVersions(report.id).subscribe(versions => {
          report.versions = versions;
          report.status = this.ReportStatus.SUBMITTED;
          this.setAssignmentStatusLabel(assignment);
        });
        this.mySnackBar.openSnackBar('Version submitted successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('Error while submitting new version', MessageType.ERROR, 3);
      }
    }
  }

  setReportsToAssignment(assignment: Assignment, reportList: Report[]) {
    assignment.reports = reportList;
    if (this.authService.isProfessor()) {
      this.allReports.set(assignment.id, assignment.reports);
      this.filteredReports.set(assignment.id, assignment.reports);
    } else {
      this.studentReports.set(assignment.id, assignment.reports[0]);
    }
  }

  setOwnerToReports(reports, owners) {
    reports.forEach((report, i) => reports[i].owner = owners[i]);
  }

  setVersionToReports(reports, versions) {
    reports.forEach((report, i) => reports[i].versions = versions[i]);
  }

  getReportForStudent(assignment: Assignment, studentId: string) {
    if (this.authService.isProfessor())
      return assignment.reports?.find(r => r.owner?.id === studentId);
    else
      return assignment.reports?.[0];
  }

  getStudentReportForAssignment(assignment: Assignment): Report {
    return this.studentReports.get(assignment.id);
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

  filterReports() {
    const statusCheckedNames: string[] = this.reportStatusFilter.filter(rsf => rsf.checked).map(r => r.name);
    this.allReports.forEach((v, k) => {
      this.filteredReports.set(k, this.allReports.get(k).filter(rep => statusCheckedNames.includes(rep.status)));
      this.filteredReports.get(k).sort((a, b) => Report.sortData(a, b));
    });
  }

  openLastVersion(report: Report, assignment: Assignment) {
    this.openVersionDialog(report.versions[report.versions.length - 1], report, assignment, true);
  }

  isReportGradable(report: Report, assignment: Assignment): boolean {
    return this.isAssignmentExpired(assignment) &&
            report.status === ReportStatus.SUBMITTED;
  }

  isReportSubmittable(assignment: Assignment): boolean {
    const status = this.getReportForStudent(assignment, this.authService.getMyId())?.status;
    return status === ReportStatus.READ || status === ReportStatus.REVISED;
  }

  isAssignmentExpired(assignment: Assignment): boolean {
    return this.utility.formatDate(assignment.expiryDate).valueOf() < Date.now();
  }

  setAssignmentStatusLabel(assignment: Assignment) {
    let label: string;
    let className: string;
    if (this.authService.isProfessor()) {
      if (this.isAssignmentExpired(assignment)) {
        const isSomeoneToGrade = this.allReports.get(assignment.id)?.find(report => report.status !== ReportStatus.GRADED);
        if (isSomeoneToGrade) {
          className = 'status-span-expired';
          label = 'EXPIRED';
        }
        else {
          className = 'status-span-completed';
          label = 'COMPLETED';
        }
      } else {
        className = 'status-span-in-progress';
        label = 'IN PROGRESS';
      }
    } else {
      const status = this.getReportForStudent(assignment, this.authService.getMyId())?.status;
      switch (status) {
        case ReportStatus.NULL:
          className = 'status-span-new';
          label = 'NEW';
          break;
        case ReportStatus.REVISED:
          className = 'status-span-revised';
          label = 'REVISED';
          break;
        case ReportStatus.GRADED:
          className = 'status-span-graded';
          label = 'GRADED';
          break;
        case ReportStatus.SUBMITTED:
          className = 'status-span-submitted';
          label = 'SUBMITTED';
          break;
        default:
          className = 'status-span-in-progress';
          label = 'IN PROGRESS';
      }
    }
    this.assignmentStatusMap.set(assignment.id, {label, className});
  }

  markAsRead(assignment: Assignment, report: Report) {
    if (this.authService.isProfessor())
      return;

    if (report?.status === ReportStatus.NULL) {
      this.labService.markReportAsRead(report.id).subscribe(() => {
        report.status = ReportStatus.READ;
        this.setAssignmentStatusLabel(assignment);
      });
    }
  }
}
