import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Version} from '../../models/version.model';

@Component({
  selector: 'app-add-version-dialog',
  templateUrl: 'add-version-dialog.component.html',
  styleUrls: ['./add-version-dialog.component.css']
})
export class AddVersionDialogComponent implements OnInit {

  form: FormGroup;
  title: string;
  content: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddVersionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.content = data.content;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.title, Validators.required],
      content: [this.content, Validators.required],
    });
  }

  confirm() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
