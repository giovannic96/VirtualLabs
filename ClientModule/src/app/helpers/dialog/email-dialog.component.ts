import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-email-dialog',
  templateUrl: 'email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent implements OnInit {

  form: FormGroup;
  to: string[];
  subject: string;
  body: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<EmailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.to = data.to;
    this.subject = data.subject;
    this.body = data.body;
  }

  ngOnInit() {
    this.form = this.fb.group({
      to: [{ value: this.to, disabled: true }],
      subject: [this.subject],
      body: [this.body]
    });
  }

  send() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
