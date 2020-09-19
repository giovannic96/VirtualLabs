import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {Course} from '../../models/course.model';
import {CourseService} from '../../services/course.service';
import {MinLowerThanMax} from '../min-lower-than-max.validator';
import {MatDialogRef} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";

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

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  constructor(private dialogRef: MatDialogRef<CreateCourseDialogComponent>,
              private formBuilder: FormBuilder,
              private courseService: CourseService) {
    this.basicForm = this.formBuilder.group({
      name: ['', Validators.required],
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

      console.log('dto prima di partire', course.getDTO())
      this.courseService.createCourse(course.getDTO()).subscribe(dto => {
        console.log('dto tornato indietro', dto);
      });
    }


      /*

      this.form.controls.min.value
      this.form.controls.max.value
      this.form.controls.description.value
      this.form.controls.prerequisites.value
      this.form.controls.topics.value

       */

  }

  allFormsAreValid() {
    return this.basicForm.valid &&
      this.descriptionControl.valid &&
      this.prerequisitesControl.valid &&
      this.topicsControl.valid;
  }

  close() {
    this.dialogRef.close();
  }
}
