import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {Course} from '../../models/course.model';
import {CourseService} from '../../services/course.service';
import {MinLowerThanMax} from '../min-lower-than-max.validator';
import {Student} from '../../models/student.model';
import {Professor} from '../../models/professor.model';
import {ProfessorService} from '../../services/professor.service';
import Utility from '../utility';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {concatMap, finalize, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MessageType, MySnackBarComponent} from '../my-snack-bar.component';
import {MatButton} from '@angular/material/button';
import {Assignment} from '../../models/assignment.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-create-course-dialog',
  templateUrl: 'course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

  MAX_CONTENT_LENGTH = 1024;

  public basicForm: FormGroup;
  public descriptionControl: FormControl;
  public prerequisitesControl: FormControl;
  public topicsControl: FormControl;

  loading: boolean;
  currentSelectedOption: Professor;
  mySelf: Professor;
  filteredProfessors: Professor[] = [];
  selectedProfessors: Professor[] = [];

  public utility: Utility;

  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('addProfessorInput') addProfessorInput: ElementRef;

  constructor(public authService: AuthService,
              private dialogRef: MatDialogRef<CourseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              private professorService: ProfessorService,
              private mySnackBar: MySnackBarComponent) {

    this.utility = new Utility();

    this.professorService.allProfessors().subscribe(all => {
      const id = this.authService.getMyId();
      this.filteredProfessors = all.filter(prof => prof.id !== id);
    });

    this.professorService.professor(this.authService.getMyId()).subscribe(myself => this.mySelf = myself);

    this.basicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      acronym: ['', [Validators.required, Validators.maxLength(3)]],
      min: ['', [Validators.required, Validators.min(2), Validators.max(10)]],
      max: ['', [Validators.required, Validators.min(2), Validators.max(10)]]
    }, {
      validators: MinLowerThanMax('min', 'max')
    });

    this.descriptionControl = formBuilder.control('', [Validators.required, Validators.maxLength(this.MAX_CONTENT_LENGTH)]);
    this.prerequisitesControl = formBuilder.control('', [Validators.required, Validators.maxLength(this.MAX_CONTENT_LENGTH)]);
    this.topicsControl = formBuilder.control('', [Validators.required, Validators.maxLength(this.MAX_CONTENT_LENGTH)]);

    if (data.courseExists) {
      const course: Course = data.course;
      this.basicForm.controls.name.setValue(course.name);
      this.basicForm.controls.name.disable();
      this.basicForm.controls.acronym.setValue(course.acronym);
      this.basicForm.controls.acronym.disable();
      this.basicForm.controls.min.setValue(course.minTeamSize);
      this.basicForm.controls.max.setValue(course.maxTeamSize);
      const info = JSON.parse(course.info);
      this.descriptionControl.setValue(info.description);
      this.prerequisitesControl.setValue(info.prerequisites);
      this.topicsControl.setValue(info.topics);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  onSubmit() {

    if (this.allFormsAreValid()) {
      const course = new Course(
        this.basicForm.controls.name.value,
        this.basicForm.controls.acronym.value,
        true,
        this.basicForm.controls.min.value,
        this.basicForm.controls.max.value,
        JSON.stringify({
          description: this.descriptionControl.value,
          prerequisites: this.prerequisitesControl.value,
          topics: this.topicsControl.value,
        })
      );

      // check if data submitted are the same as before
      if (this.data.course && this.equalToPrevious()) {
        this.dialogRef.close(new Course('', '', false, 0, 0, ''));
        return;
      }

      this.loading = true;

      if (this.data.courseExists) { // COURSE EDIT
        this.courseService.editCourse(this.data.course.name, course.getDTO()).subscribe(res => {
            if (res)
              this.dialogRef.close(course);
            else
              this.dialogRef.close(null);
          }, () =>
          this.dialogRef.close(null)
        );
      }
      else { // COURSE CREATION
        this.courseService.createCourse(course.getDTO()).pipe(
          mergeMap(() => {
            return this.selectedProfessors;
          }),
          mergeMap(professor => {
            return this.courseService.assignProfessor(course.name, professor.id);
          })
        ).subscribe(() => null,
            error => this.dialogRef.close(null),
          () => this.dialogRef.close(course));
      }
    }
  }

  allFormsAreValid() {
    return this.basicForm.valid &&
      this.descriptionControl.valid &&
      this.prerequisitesControl.valid &&
      this.topicsControl.valid;
  }

  equalToPrevious(): boolean {
    return this.data.course.name === this.basicForm.controls.name.value
      && this.data.course.acronym === this.basicForm.controls.acronym.value
      && this.data.course.minTeamSize === this.basicForm.controls.min.value
      && this.data.course.maxTeamSize === this.basicForm.controls.max.value
      && JSON.stringify(JSON.parse(this.data.course.info)) === JSON.stringify({
        description: this.descriptionControl.value,
        prerequisites: this.prerequisitesControl.value,
        topics: this.topicsControl.value,
      });
  }

  displayProfessor(professor: Professor) {
    return professor.surname + ' ' + professor.name + ' (' + professor.id + ')';
  }

  setCurrentSelectedOption(event) {
    this.currentSelectedOption = event.option.value;
    // this.addButton.disabled = this.tableStudents.data.includes(this.currentSelectedOption);
  }

  addProfessor(professor: Professor) {
    this.filteredProfessors.splice(this.filteredProfessors.indexOf(professor), 1);
    this.selectedProfessors.push(professor);
    this.selectedProfessors.sort((a, b) => Professor.sortData(a, b));
    if (this.addProfessorInput?.nativeElement.value !== '') {
      this.addProfessorInput.nativeElement.value = '';
      this.currentSelectedOption = null;
    }
  }

  removeProfessor(index: number) {
    const professor = this.selectedProfessors[index];
    this.selectedProfessors.splice(index, 1);
    this.filteredProfessors.push(professor);
    this.filteredProfessors.sort((a, b) => Professor.sortData(a, b));
  }

  close() {
    this.dialogRef.close();
  }
}
