import {Component, OnInit} from '@angular/core';
import {Assignment} from '../../../models/assignment.model';
import {concatMap, filter, last, map, mergeMap, tap} from 'rxjs/operators';
import {CourseService} from '../../../services/course.service';
import {forkJoin, from, Observable, Observer, of, Subject} from 'rxjs';
import {Course} from '../../../models/course.model';
import {LabService} from '../../../services/lab.service';
import {Report, ReportStatus} from '../../../models/report.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VersionDialogComponent} from '../../../helpers/version-dialog.component';
import {ThemePalette} from '@angular/material/core';
import {Student} from '../../../models/student.model';
import {Version} from '../../../models/version.model';

export interface ReportStatusFilter {
  name: string;
  checked: boolean;
  color: ThemePalette;
}

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit {

  private currentCourse: Observable<Course>;
  public assignmentList: Assignment[];
  public gridColumns = 3;

  allReports: Map<number, Report[]>;
  filteredReports: Map<number, Report[]>;
  reportStatusFilter: ReportStatusFilter[];

  constructor(private courseService: CourseService,
              private labService: LabService,
              private dialog: MatDialog) {

    this.currentCourse = this.courseService.getSelectedCourse().pipe(filter(course => !!course));
    this.allReports = new Map<number, Report[]>();
    this.filteredReports = new Map<number, Report[]>();
    this.reportStatusFilter = [
      {name : ReportStatus.NULL, checked : true, color: undefined},
      {name : ReportStatus.READ, checked : true, color: 'primary'},
      {name : ReportStatus.SUBMITTED, checked : true, color: 'accent'},
      {name : ReportStatus.REVISED, checked : true, color: 'warn'},
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
              assignment.reports = reports;
              this.allReports.set(assignment.id, assignment.reports);
              this.filteredReports.set(assignment.id, assignment.reports);

              const ownerRequests: Observable<Student>[] = [];
              const versionRequests: Observable<Version[]>[] = [];
              reports.forEach(report => {
                ownerRequests.push(this.labService.getReportOwner(report.id));
                versionRequests.push(this.labService.getReportVersions(report.id));
              });

              forkJoin(ownerRequests).subscribe(owners => {
                reports.forEach((report, i) => reports[i].owner = owners[i]);
                assignmentCounter--;
                if (!assignmentCounter)
                  this.filterReports();
              });

              forkJoin(versionRequests).subscribe(versions => {
                reports.forEach((report, i) => reports[i].versions = versions[i]);
              });

              return reports;
            })).subscribe();
      })).subscribe();
  }

  ngOnInit(): void {
  }

  formatDate(date: string) {
    const splitted = date.toString().split(',').map(s => Number(s));
    return new Date(splitted[0], splitted[1] - 1, splitted[2], splitted[3], splitted[4], splitted[5]);
  }

  openVersionDialog(versionTitle: string, versionContent: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: versionTitle,
      content: versionContent
    };

    const dialogRef = this.dialog.open(VersionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) { // i.e. close button was pressed
          /*
          this.notificationService.sendMessage(emails, data.subject, data.body).subscribe( () => {
            this.mySnackBar.openSnackBar('Email sent successfully', MessageType.SUCCESS, 3);
          }, () => {
            this.mySnackBar.openSnackBar('Error while sending the email. Some students may not have received the email correctly', MessageType.ERROR, 3);
          });
           */
        }
      }
    );
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
        return '#07ff15';
      }
      case ReportStatus.REVISED: {
        return '#02b2ff';
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
}
