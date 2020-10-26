import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Student} from '../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {CourseService} from '../../services/course.service';
import {delay} from 'rxjs/operators';

enum StudentStatus {
  VALID,
  ALREADY_ENROLLED,
  UNREGISTERED,
  NOT_FOUND,
}

@Component({
  selector: 'app-csv-import-dialog',
  templateUrl: 'csv-import-dialog.component.html',
  styleUrls: ['./csv-import-dialog.component.css']
})
export class CsvImportDialogComponent implements OnInit {

  csvChecked: boolean;
  studentsFound = new MatTableDataSource<Student>();
  columnsToDisplay: string[];
  statusMap: Map<string, string>;
  adviseNeeded: boolean;
  canProceed: boolean;
  messageToShow: string;

  constructor(public dialogRef: MatDialogRef<CsvImportDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private courseService: CourseService) {
    this.studentsFound = new MatTableDataSource<Student>();
    this.statusMap = new Map<string, string>();

    const formData = new FormData();
    formData.append('file', this.data.file);
    this.courseService.checkCsv(this.data.course.name, formData).pipe(delay(2500)).subscribe(jsonResponse => {
      const statusArray: StudentStatus[] = [];
      this.studentsFound.data = jsonResponse.studentList.sort((s1: Student, s2: Student) => jsonResponse.statusMap[s1.id] - jsonResponse.statusMap[s2.id]);
      Object.keys(jsonResponse.statusMap).forEach(k => {
        const status = jsonResponse.statusMap[k];
        statusArray.push(status);
        this.statusMap.set(k, this.convertStatus(status));
      });

      this.chooseMessageToShow(statusArray);
      this.csvChecked = true;
    }, () => this.dialogRef.close());

    this.columnsToDisplay = ['id', 'username', 'name', 'surname', 'status'];
  }

  ngOnInit(): void { }

  convertStatus(status: StudentStatus): string {
    switch (status) {
      case StudentStatus.VALID:
        return 'VALID';
      case StudentStatus.NOT_FOUND:
        return 'NOT FOUND';
      case StudentStatus.UNREGISTERED:
        return 'UNREGISTERED';
      case StudentStatus.ALREADY_ENROLLED:
        return 'ALREADY ENROLLED';
      default:
        return 'UNKNOWN';
    }
  }

  findCLassForStudent(studentId: string): string {
    const status: string = this.statusMap.get(studentId);
    switch (status) {
      case 'VALID':
        return 'valid-row';
      case 'ALREADY ENROLLED':
      case 'UNREGISTERED':
        return 'warning-row';
      case 'NOT FOUND':
        return 'error-row';
      default:
        return '';
    }
  }

  chooseMessageToShow(statusArray: StudentStatus[]) {
    if (statusArray.length === 0) {
      this.messageToShow = 'No students have been found on your file.<br>' +
        'Abort and choose another file.';
      this.adviseNeeded = true;
      this.canProceed = false;
    }
    else if (statusArray.includes(StudentStatus.VALID)) {
      if (statusArray.includes(StudentStatus.ALREADY_ENROLLED) ||
          statusArray.includes(StudentStatus.UNREGISTERED) ||
          statusArray.includes(StudentStatus.NOT_FOUND)) {
        this.messageToShow = 'Only the students with a VALID status will be enrolled to the course.<br>' +
          'All the other students found will be ignored.';
        this.adviseNeeded = true;
      }
      else {
        this.adviseNeeded = false;
      }
      this.canProceed = true;
    }
    else {
      this.messageToShow = 'None of the students found can be enrolled to this course';
      this.adviseNeeded = true;
      this.canProceed = false;
    }
  }

  confirmEnroll() {
    const confirmedStudents = this.studentsFound.data.filter(s => this.statusMap.get(s.id) === 'VALID').map(s => s.id);
    this.dialogRef.close(confirmedStudents);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
