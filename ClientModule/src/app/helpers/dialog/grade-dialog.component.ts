import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Version} from '../../models/version.model';
import {Student} from "../../models/student.model";

@Component({
  selector: 'app-grade-dialog',
  templateUrl: 'grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.css']
})
export class GradeDialogComponent implements OnInit {

  form: FormGroup;
  version: Version;
  comment: string;
  grade: number;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<GradeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.version = data.version;
    this.comment = data.comment;
    this.grade = data.grade;
  }

  ngOnInit() {
    this.form = this.fb.group({
      comment: [this.comment],
      grade: [this.grade],
    });
  }

  confirm(grade: string) {
    this.form.controls.grade.setValue(Number(grade));
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
