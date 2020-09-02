import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Version} from '../../models/version.model';

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
  }

  ngOnInit() {
    this.form = this.fb.group({
      comment: '',
      grade: ['', Validators.required],
    });
  }

  confirm() {
    if (this.form.invalid)
      return;

    const response = {
      grade: this.form.get('grade').value,
      comment: this.form.get('comment').value
    };

    this.dialogRef.close(response);
  }

  close() {
    this.dialogRef.close();
  }
}
