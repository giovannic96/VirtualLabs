import {MatButton} from '@angular/material/button';
import {Student} from '../../../models/student.model';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Course} from '../../../models/course.model';
import {CourseService} from '../../../services/course.service';
import {StudentService} from '../../../services/student.service';
import {MessageType, MySnackBarComponent} from '../../../helpers/my-snack-bar.component';
import {filter} from 'rxjs/operators';
import {MyDialogComponent} from '../../../helpers/dialog/my-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import Utility from '../../../helpers/utility';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, AfterViewInit {

  // Title
  title = 'VirtualLabs';

  tableStudents = new MatTableDataSource<Student>();
  notEnrolledStudents: Student[];
  selectedCourse: Course;

  // ViewChild
  @ViewChild('addStudentInput') addStudentInput: ElementRef;
  @ViewChild('addButton') addButton: MatButton;
  @ViewChild(MatTable) table: MatTable<Student>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // Students
  currentSelectedOption: Student;

  filteredStudents: Student[] = [];
  selectedStudents = new SelectionModel<Student>(true);

  isSelectionPopupToShow = false;
  isAllSelected = false;

  // Columns
  columnsToDisplay: string[];

  studentsFile: File;

  public utility: Utility;

  updateTableStudents(tableData: Student[]) {
    this.tableStudents = new MatTableDataSource<Student>(tableData);
    this.tableStudents.data.sort((a, b) => Student.sortData(a, b));
    this.updateView();
    this.filterData();
  }

  constructor(private courseService: CourseService,
              private studentService: StudentService,
              private mySnackBar: MySnackBarComponent,
              private dialog: MatDialog) {

    this.utility = new Utility();

    this.tableStudents = new MatTableDataSource<Student>();
    this.columnsToDisplay = ['select', 'id', 'surname', 'name'];

    this.courseService.getSelectedCourse().pipe(
      filter(course => !!course)).subscribe(course => {
      this.selectedCourse = course;
      this.getEnrolledStudents(course.name);
      this.getNotEnrolledStudents(course.name);
    });
  }

  ngOnInit(): void {
  }

  getAllStudents() {
    this.studentService.getAll().subscribe(students => {
      this.notEnrolledStudents = students;
      this.notEnrolledStudents.sort((a, b) => Student.sortData(a, b));
    });
  }

  getEnrolledStudents(courseName: string) {
    this.courseService.getEnrolled(courseName).subscribe(enrolled => {
      this.updateTableStudents(enrolled);
    });
  }

  getNotEnrolledStudents(courseName: string) {
    this.courseService.getNotEnrolled(courseName).subscribe(notEnrolled => {
      this.notEnrolledStudents = notEnrolled;
      this.notEnrolledStudents.sort((a, b) => Student.sortData(a, b));
      this.filterData();
    });
  }

  enrollStudent(student: Student) {
    this.courseService.enroll(this.selectedCourse.name, student.id).subscribe(s => {
      if (s !== undefined) {
        // add student to tableStudents
        this.notEnrolledStudents.splice(this.notEnrolledStudents.indexOf(student), 1);
        this.tableStudents.data.push(student);
        this.updateTableStudents(this.tableStudents.data);
        this.mySnackBar.openSnackBar('Student enrolled successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('Student already enrolled', MessageType.ERROR, 5);
      }
    });
  }

  enrollStudents(event) {
    this.studentsFile = event.target.files[0];

    if (!this.studentsFile.name.endsWith('.csv')) {
      this.mySnackBar.openSnackBar('File format not valid. Please upload a .csv file', MessageType.ERROR, 5);
      return;
    }

    const formData = new FormData();
    formData.append('file', this.studentsFile);
    this.courseService.enrollMany(this.selectedCourse.name, formData).subscribe(students => {
      if (students && students.length > 0 && students[students.length - 1].id === null) {
        students.pop(); // remove student with null id
        students.forEach(s => { // add students to tableStudents
          this.tableStudents.data.push(s);
          this.notEnrolledStudents.splice(this.notEnrolledStudents.indexOf(s), 1);
        });
        this.updateTableStudents(this.tableStudents.data);
        this.mySnackBar.openSnackBar('Some students may not have been enrolled correctly', MessageType.WARNING, 5);
      }
      else if (students.length !== 0) {
        students.forEach(s => this.tableStudents.data.push(s)); // add students to tableStudents
        this.updateTableStudents(this.tableStudents.data);
        this.mySnackBar.openSnackBar('Students enrolled successfully', MessageType.SUCCESS, 3);
      } else {
        this.mySnackBar.openSnackBar('All students were already enrolled in the course', MessageType.WARNING, 5);
      }
    }, error => this.mySnackBar.openSnackBar('Impossible to enroll the students', MessageType.ERROR, 5));
  }

  async openDialog() {

    // Prepare a message for the dialog based on selection
    let message;
    if (this.isAllSelected) {
      message = 'You are unrolling all the students of this course';
    } else {
      message = 'You are unrolling ' + this.selectedStudents.selected.length +
        (this.selectedStudents.selected.length > 1 ? ' students' : ' student') + ' from this course';
      const otherPage = this.selectedStudents.selected.length - this.getCurrentPageSelected().length;
      if (!!otherPage) {
        this.selectedStudents.selected.length > 1 ?
          message += '<br>(' + otherPage + ' of them ' + (otherPage === 1 ? 'is' : 'are') + ' on a different page)' :
          message += '<br>(He/She is on a different page)';
      }

    }

    // Open a dialog and get the response as an 'await'
    const areYouSure = await this.dialog.open(MyDialogComponent, {disableClose: true, data: {
        message,
        buttonConfirmLabel: 'CONFIRM',
        buttonCancelLabel: 'CANCEL'
      }
    }).afterClosed().toPromise();

    // Check the response when dialog closes
    if (areYouSure) {
      this.unrollStudents();
    }
  }

  unrollStudents() {
    const studentIds: string[] = [];
    this.selectedStudents.selected.forEach(s => studentIds.push(s.id));
    return;
    this.courseService.unroll(this.selectedCourse.name, studentIds).subscribe(() => {
      const tmpStudentList = [];

      this.tableStudents.data.forEach(student => {
        if (!this.selectedStudents.selected.includes(student))
          tmpStudentList.push(student);
        else
          this.notEnrolledStudents.push(student);
      });
      this.notEnrolledStudents.sort((a, b) => Student.sortData(a, b));
      this.selectedStudents.clear();
      this.updateTableStudents(tmpStudentList);

      this.mySnackBar.openSnackBar('Selected student unrolled successfully', MessageType.SUCCESS, 3);
    });
  }

  ngAfterViewInit() {
    this.tableStudents.paginator = this.paginator;
  }

  isCurrentPageAllSelected() {
    return this.getCurrentPageStudents().every(student => this.selectedStudents.isSelected(student));
  }

  toggleMasterCheckbox() {
    if (this.isCurrentPageAllSelected()) {
      this.selectedStudents.deselect(...this.getCurrentPageStudents());
      this.isSelectionPopupToShow = false;
      this.isAllSelected = false;
    } else {
      this.selectedStudents.select(...this.getCurrentPageStudents());
      this.isSelectionPopupToShow = true;
      this.isAllSelected = this.paginator.pageSize >= this.tableStudents.data.length;
    }
  }

  toggleStudentCheckBox(student: Student) {
    this.selectedStudents.toggle(student);
    this.isSelectionPopupToShow = false;
    this.isAllSelected = false;
  }

  displayStudent(student: Student) {
    return student.surname + ' ' + student.name + ' (' + student.id + ')';
  }

  updateView() {
    // clear textbox and update table
    if (this.addStudentInput !== undefined && this.addStudentInput.nativeElement.value !== '') {
      this.addStudentInput.nativeElement.value = '';
      this.currentSelectedOption = null;
    }
    this.tableStudents.paginator = this.paginator;
    this.tableStudents.sort = this.sort;
  }

  filterData() {
    // get input value
    const inputValue = this.addStudentInput.nativeElement.value.toLowerCase();
    let enableButton = false;

    // filter data, i.e. display only a part of the 'notEnrolledStudents' array, according to the input value
    if (this.notEnrolledStudents) {
      this.filteredStudents = this.notEnrolledStudents.filter(student => {
        const studentString = student.surname + ' ' + student.name + ' (' + student.id + ')';
        if (studentString.toLowerCase() === inputValue) {
          enableButton = true;
          this.currentSelectedOption = student;
        }
        return studentString.toLowerCase().includes(inputValue);
      });
    }

    // enable/disable addButton
    this.addButton.disabled = !enableButton;
  }

  setCurrentSelectedOption(event) {
    this.currentSelectedOption = event.option.value;
    this.addButton.disabled = this.tableStudents.data.includes(this.currentSelectedOption);
  }

  getCurrentPageStudents(): Student[] {
    return this.tableStudents._pageData(this.tableStudents.sortData(this.tableStudents.data, this.sort));
  }

  getCurrentPageSelected(): Student[] {
    return this.tableStudents._pageData(this.tableStudents.sortData(this.tableStudents.data, this.sort))
        .filter(student => this.selectedStudents.isSelected(student));
  }

  selectAllStudents() {
    this.selectedStudents.select(...this.tableStudents.data);
    this.isAllSelected = true;
  }


}
