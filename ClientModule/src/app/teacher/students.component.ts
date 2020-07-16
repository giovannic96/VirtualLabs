import { MatButton } from '@angular/material/button';
import { Student } from '../student.model';
import {Component, ViewChild, ElementRef, OnInit, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, AfterViewInit {
  // Title
  title = 'ai20-lab05';

  // ViewChild
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  @ViewChild('addStudentInput') addStudentInput: ElementRef;
  @ViewChild('addButton') addButton: MatButton;
  @ViewChild(MatTable) table: MatTable<Student>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // Students
  currentSelectedOption: Student;
  @Input() allStudents: Student[];

  _tableStudents: MatTableDataSource<Student>;
  @Input() set tableStudents(tableStudents: MatTableDataSource<Student>) {
    this._tableStudents = new MatTableDataSource<Student>();
    this._tableStudents = tableStudents;
    this.updateView();
  }
  get tableStudents(): MatTableDataSource<Student> {
    return this._tableStudents;
  }

  @Output() studentSelect = new EventEmitter<Student>();
  @Output() studentDelete = new EventEmitter<Student[]>();

  filteredStudents: Student[] = [];
  selectedStudents = new SelectionModel<Student>(true);

  // Columns
  columnsToDisplay: string[];

  constructor() {
    // Initialize columns
    this.columnsToDisplay = ['select', 'id', 'name', 'firstName'];
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.tableStudents.paginator = this.paginator;
  }

  isAllSelected() {
    return this.selectedStudents.selected.length === this.tableStudents.data.length;
  }

  toggleMasterCheckbox() {
    this.isAllSelected() ?
      this.selectedStudents.clear() :
      this.tableStudents.data.forEach(student => this.selectedStudents.select(student));
  }

  displayStudent(student: Student) {
    return student.name + ' ' + student.firstName + ' (' + student.id + ')';
  }

  updateView() {
    // update filtered (not enrolled) students
    if (this.allStudents) {
      this.filteredStudents = [];
      this.allStudents.forEach(s => {
        if(!this.tableStudents.data.map(student => student.id).includes(s.id))
          this.filteredStudents.push(s);
      });
      this.filteredStudents.sort((a, b) => Student.sortData(a, b));
    }

    // clear textbox and update table
    if(this.addStudentInput != undefined && this.addStudentInput.nativeElement.value != '') {
      this.addStudentInput.nativeElement.value = '';
      this.currentSelectedOption = null;
    }
    if(this.table) this.table.renderRows();
    this.tableStudents.paginator = this.paginator;
    this.tableStudents.sort = this.sort;
  }

  filterData() {
    // get input value
    const inputValue = this.addStudentInput.nativeElement.value.toLowerCase();
    let enableButton = false;

    // filter data, i.e. display only a part of the 'allStudents' array, according to the input value
    this.filteredStudents = this.allStudents.filter(student => {
      const studentString = student.name + ' ' + student.firstName + ' (' + student.id + ')';
      if (studentString.toLowerCase() === inputValue && !this.tableStudents.data.includes(student)) {
        enableButton = true;
        this.currentSelectedOption = student;
      }
      return studentString.toLowerCase().includes(inputValue) && !this.tableStudents.data.includes(student);
    });

    // enable/disable addButton
    this.addButton.disabled = !enableButton;
  }

  enrollStudent() {
    this.studentSelect.emit(this.currentSelectedOption);
  }

  unrollStudents() {
    let selected = [];

    this.tableStudents.data.forEach(student => {
      if (this.selectedStudents.isSelected(student)) {
        this.selectedStudents.deselect(student);
        selected.push(student);
      }
    });
    this.studentDelete.emit(selected);
  }

  setCurrentSelectedOption(event) {
    this.currentSelectedOption = event.option.value;
    this.addButton.disabled = this.tableStudents.data.includes(this.currentSelectedOption);
  }
}
