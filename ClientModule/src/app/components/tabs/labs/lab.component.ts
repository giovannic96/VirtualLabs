import {Component, OnInit} from '@angular/core';
import {Assignment} from '../../../models/assignment.model';
import {catchError, concatMap, delay, filter, last, map, mergeMap, tap} from 'rxjs/operators';
import {CourseService} from '../../../services/course.service';
import {EMPTY, forkJoin, from, Observable, Observer, of, Subject} from 'rxjs';
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
import {MyDialogComponent} from '../../../helpers/dialog/my-dialog.component';
import {AddVersionDialogComponent} from '../../../helpers/dialog/add-version-dialog.component';
import {HttpErrorResponse} from '@angular/common/http';

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
export class LabComponent implements OnInit {

  private currentCourse: Observable<Course>;
  public assignmentList: Assignment[];
  public gridColumns = 4;
  public ReportStatus = ReportStatus;

  allReports: Map<number, Report[]>;
  filteredReports: Map<number, Report[]>;
  reportStatusFilter: ReportStatusFilter[];

  constructor(private courseService: CourseService,
              private labService: LabService,
              private notificationService: NotificationService,
              private studentService: StudentService,
              private dialog: MatDialog,
              private mySnackBar: MySnackBarComponent) {

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));
    this.allReports = new Map<number, Report[]>();
    this.filteredReports = new Map<number, Report[]>();
    this.reportStatusFilter = [
      {name : ReportStatus.NULL, checked : true, color: undefined},
      {name : ReportStatus.READ, checked : true, color: 'primary'},
      {name : ReportStatus.SUBMITTED, checked : true, color: 'accent'},
      {name : ReportStatus.REVISED, checked : true, color: 'warn'},
      {name : ReportStatus.GRADED, checked : true, color: 'accent'},
    ];

    let assignmentCounter: number;

    this.currentCourse.pipe(
      concatMap(course => this.courseService.getAllAssignments(course.name)),
      mergeMap(assignmentList => {
        this.assignmentList = assignmentList;
        assignmentCounter = assignmentList.length;
        return assignmentList;
      }),
      tap(assignment => {
        this.labService.getAssignmentReports(assignment.id)
          .pipe(
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
                if (!assignmentCounter)
                  this.filterReports();
              });

              forkJoin(versionRequests).subscribe(versions => {
                // assign version to each report
                this.setVersionToReports(reports, versions);
              });

              return reports;
            })).subscribe();
      })).subscribe();
  }

  ngOnInit(): void {
  }

  openVersionDialog(version: Version, report: Report, assignment: Assignment, isLast: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    dialogConfig.data = {
      version,
      isLast
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
                  this.openGradeDialog(report, assignment);
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

  openGradeDialog(report: Report, assignment) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      version: report.versions[report.versions.length - 1]
    };

    const emails = [report.owner.username];
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
              // TODO: appena funziona il login usare il current user per settare il professore che ha fatto la modifica o l'inserimento
              const a = this.assignmentList.find(el => el.id === asmnt.id);

              // edit selected assignment
              a.name = asmnt.name;
              a.content = asmnt.content;
              a.expiryDate = this.localDateTimeToString(asmnt.expiryDate);
              this.mySnackBar.openSnackBar('Assignment edited successfully', MessageType.SUCCESS, 3);
            }, error => this.mySnackBar.openSnackBar('Assignment editing failed', MessageType.ERROR, 3));
        }
        else {
          this.courseService.addAssignment(course.name, dialogResponse.getDTO()).pipe(
            concatMap(newId => this.labService.getAssignment(newId)),
            concatMap(newAssignment => {
              newAssignment.expiryDate = this.localDateTimeToString(newAssignment.expiryDate);
              newAssignment.releaseDate = this.localDateTimeToString(newAssignment.releaseDate);
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
    const areYouSure = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
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

  async openAddVersionDialog(report: Report) {

    const data = report;
    const dialogRef = this.dialog.open(AddVersionDialogComponent, {disableClose: true, data});
    const dialogResponse: any = await dialogRef.afterClosed().toPromise();

    if (dialogResponse) {
      this.labService.getReportVersions(report.id).subscribe(versions => report.versions = versions);
    }
  }

  setReportsToAssignment(assignment: Assignment, reportList: Report[]) {
    assignment.reports = reportList;
    this.allReports.set(assignment.id, assignment.reports);
    this.filteredReports.set(assignment.id, assignment.reports);
  }

  setOwnerToReports(reports, owners) {
    reports.forEach((report, i) => reports[i].owner = owners[i]);
  }

  setVersionToReports(reports, versions) {
    reports.forEach((report, i) => reports[i].versions = versions[i]);
  }

  getReportForStudent(assignment: Assignment, studentId: string) {
    return assignment.reports?.find(r => r.owner?.id === studentId);
  }

  isProfessor() {
    return true;
  }

  getColorForStatus(status: string) {
    switch (status) {
      case ReportStatus.NULL: {
        return '#818181';
      }
      case ReportStatus.READ: {
        return '#ff8400';
      }
      case ReportStatus.SUBMITTED: {
        return '#ffe602';
      }
      case ReportStatus.REVISED: {
        return '#02b2ff';
      }
      case ReportStatus.GRADED: {
        return '#07ff15';
      }
      default: {
        return '#000000';
      }
    }
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

  formatDate(date: string) {
    const splitted = date.toString().split(',').map(s => Number(s));
    return new Date(splitted[0], splitted[1] - 1, splitted[2], splitted[3], splitted[4], splitted[5]);
  }

  localDateTimeToString(localDateTime: string): string {
    // ex. FROM '2022-12-21T14:10:46' TO '2022,12,21,14,10,46'
    const dateTime = localDateTime.toString().split('T');
    const date = dateTime[0].split('-');
    const time = dateTime[1].split(':');
    return '' + date[0] + ',' + date[1] + ',' + date[2] + ',' + time[0] + ',' + time[1] + ',' + time[2];
  }

  toLocalDateTime(date: string): string {
    // ex. FROM '2020,7,1,18,20,2' TO '2022-07-01T18:20:02'
    const dateSplit = date.toString().split(',');
    const day = (`0${dateSplit[2]}`).slice(-2); // add '0' in front of the number, if necessary
    const month = (`0${dateSplit[1]}`).slice(-2); // add '0' in front of the number, if necessary
    const hours = (`0${dateSplit[3]}`).slice(-2); // add '0' in front of the number, if necessary
    const minutes = (`0${dateSplit[4]}`).slice(-2); // add '0' in front of the number, if necessary
    const seconds = (`0${dateSplit[5]}`).slice(-2); // add '0' in front of the  number, if necessary
    return '' + dateSplit[0] + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
  }

  openLastVersion(report: Report, assignment: Assignment) {
    this.openVersionDialog(report.versions[report.versions.length - 1], report, assignment, true);
  }

  isGradable(report: Report, assignment: Assignment): boolean {
    if (this.formatDate(assignment.expiryDate).valueOf() > Date.now()) {
      return report.status === ReportStatus.SUBMITTED;
    } else {
      return !!report.versions?.length && report.status !== ReportStatus.GRADED;
    }
  }

  markAsRead(report: Report) {
    if (this.isProfessor())
      return;

    if (report.status === ReportStatus.NULL) {
      this.labService.markReportAsRead(report.id).subscribe(() => {
        report.status = ReportStatus.READ;
      });
    }
  }
}
