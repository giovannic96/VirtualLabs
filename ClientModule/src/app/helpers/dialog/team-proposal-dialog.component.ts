import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Student} from '../../models/student.model';
import {state, style, transition, trigger, useAnimation} from '@angular/animations';
import { shake } from 'ngx-animate';

@Component({
  selector: 'app-team-proposal-dialog',
  templateUrl: 'team-proposal-dialog.component.html',
  styleUrls: ['./team-proposal-dialog.component.css'],
  animations: [
    trigger('error', [
      state('false, true', style({})),
      transition('false => true', useAnimation(shake)),
    ]),
  ],
})
export class TeamProposalDialogComponent implements OnInit {

  form: FormGroup;
  onAddErrAnim = false;

  teamName: string;
  students: Student[];
  minTeamSize: number;
  maxTeamSize: number;

  initial = [];
  proposed = [];

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<TeamProposalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.teamName = data.teamName;
    this.students = data.students;
    this.minTeamSize = data.minTeamSize;
    this.maxTeamSize = data.maxTeamSize;
  }

  ngOnInit() {
    this.form = this.fb.group({
      teamName: [this.teamName, Validators.required],
    });
    this.initial = this.students;
  }

  drop(event: CdkDragDrop<Student[]>) {
    if (event.previousContainer === event.container) { // element moved inside the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else { // element moved towards the other container
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  checkForm(proposedStudents: Student[]) {
    this.onAddErrAnim = false;

    // check if team name has been inserted
    if (this.form.invalid) {
      return false;
    }

    // trigger team size error animation
    setTimeout( () => {
      if (this.proposed.length <= 0 || this.proposed.length < this.minTeamSize || this.proposed.length > this.maxTeamSize) {
        this.onAddErrAnim = true;
        return;
      }
    }, 0 );

    return !(this.proposed.length <= 0 || this.proposed.length < this.minTeamSize || this.proposed.length > this.maxTeamSize);
  }

  confirm(proposedStudents: Student[]) {
    if (!this.checkForm(proposedStudents))
      return;

    const data = {
      teamName: this.form.value.teamName,
      students: proposedStudents
    };
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

}
