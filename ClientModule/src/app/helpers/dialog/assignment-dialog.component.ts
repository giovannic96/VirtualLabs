import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Assignment} from '../../models/assignment.model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-assignment-dialog',
  templateUrl: './assignment-dialog.component.html',
  styleUrls: ['./assignment-dialog.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AssignmentDialogComponent implements OnInit {

  public assignmentFormGroup: FormGroup;
  public formIsInvalid = false;
  minDate: Date;
  maxDate: Date;
  MAX_CONTENT_LENGTH = 1024;

  constructor(public dialogRef: MatDialogRef<AssignmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private cd: ChangeDetectorRef,
              public formBuilder: FormBuilder) {
    this.minDate = new Date();
    this.maxDate = new Date(new Date().getFullYear() + 5, 11, 31);
  }

  ngOnInit(): void {
    this.assignmentFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      content: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });

    if (this.data.modelExists && this.data.assignment !== null) {
      const assignment: Assignment = this.data.assignment;
      this.assignmentFormGroup.get('name').setValue(assignment.name);
      this.assignmentFormGroup.get('content').setValue(assignment.content);
      this.assignmentFormGroup.get('expiryDate').setValue(moment(this.toDateOnly(assignment.expiryDate)));
      this.cd.detectChanges();
    }

  }

  checkForm() {
    // check if form is valid
    if (this.assignmentFormGroup.invalid) {
      this.formIsInvalid = true;
      return;
    }

    // check if data submitted are the same as before
    if (this.equalToPrevious()) {
      this.dialogRef.close(new Assignment(0, '', '', ''));
      return;
    }

    // create new assignment
    const assignment = new Assignment(null,
      this.assignmentFormGroup.get('name').value,
      this.toLocalDateTime(new Date(this.assignmentFormGroup.get('expiryDate').value.toDate())),
      this.assignmentFormGroup.get('content').value);

    this.dialogRef.close(assignment);
  }

  equalToPrevious(): boolean {
    return this.data.assignment.name === this.assignmentFormGroup.get('name').value
      && this.data.assignment.content === this.assignmentFormGroup.get('content').value
      && this.toDateOnly(this.data.assignment.expiryDate) ===
      this.toLocalDateTime(new Date(this.assignmentFormGroup.get('expiryDate').value.toDate())).substr(0, 10);
  }

  toLocalDateTime(date: Date): string {
    // ex. FROM '31/8/2020' TO '2022-12-21T23:59:59'
    const dateLocal = date.toLocaleDateString('it-IT').split( '/' );
    const day = (`0${dateLocal[0]}`).slice(-2); // add '0' in front of the day number, if necessary
    const month = (`0${dateLocal[1]}`).slice(-2); // add '0' in front of the month number, if necessary
    return '' + dateLocal[2] + '-' + month + '-' + day + 'T23:59:59';
  }

  toDateOnly(date: string): string {
    // ex. FROM '2020,7,1,23,59,59' TO '2022-12-21'
    const dateSplit = date.toString().split(',');
    const day = (`0${dateSplit[2]}`).slice(-2); // add '0' in front of the day number, if necessary
    const month = (`0${dateSplit[1]}`).slice(-2); // add '0' in front of the month number, if necessary
    return '' + dateSplit[0] + '-' + month + '-' + day;
  }
}
