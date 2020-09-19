import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {Course} from '../../models/course.model';
import {CourseService} from '../../services/course.service';
import {MinLowerThanMax} from '../min-lower-than-max.validator';
import {Student} from '../../models/student.model';
import {Professor} from '../../models/professor.model';
import {ProfessorService} from '../../services/professor.service';
import Utility from '../utility';
import {MatDialogRef} from '@angular/material/dialog';
import {concatMap, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MessageType, MySnackBarComponent} from '../my-snack-bar.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-create-course-dialog',
  templateUrl: 'create-course-dialog.component.html',
  styleUrls: ['./create-course-dialog.component.css']
})
export class CreateCourseDialogComponent implements OnInit, AfterViewInit {

  MAX_CONTENT_LENGTH = 1024;

  public basicForm: FormGroup;
  public descriptionControl: FormControl;
  public prerequisitesControl: FormControl;
  public topicsControl: FormControl;

  currentSelectedOption: Professor;
  mySelf: Professor;
  filteredProfessors: Professor[] = [];
  selectedProfessors: Professor[] = [];

  public utility: Utility;

  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('addProfessorInput') addProfessorInput: ElementRef;

  constructor(private dialogRef: MatDialogRef<CreateCourseDialogComponent>,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              private professorService: ProfessorService,
              private mySnackBar: MySnackBarComponent) {

    this.utility = new Utility();

    this.professorService.allProfessors().subscribe(all => {
      const id = this.utility.getMyId();
      this.filteredProfessors = all.filter(prof => prof.id !== id);
    });

    this.professorService.professor(this.utility.getMyId()).subscribe(myself => this.mySelf = myself);

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
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  onCreate() {
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

      this.courseService.createCourse(course.getDTO()).pipe(
        concatMap(() => {
          return this.courseService.assignProfessor(course.name, this.mySelf.id);
        }),
        mergeMap(() => {
          return this.selectedProfessors;
        }),
        mergeMap(professor => {
          return this.courseService.assignProfessor(course.name, professor.id);
        })
      ).subscribe(() => {
        this.dialogRef.close(course);
      }, error => this.dialogRef.close(-1));
    }
  }

  allFormsAreValid() {
    return this.basicForm.valid &&
      this.descriptionControl.valid &&
      this.prerequisitesControl.valid &&
      this.topicsControl.valid;
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
