import {Component, Input, OnInit} from '@angular/core';
import {Student} from "../student.model";
import {MatTableDataSource} from "@angular/material/table";
import {StudentService} from "../services/student.service";
import {core} from "@angular/compiler";

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {

  tableStudents = new MatTableDataSource<Student>();
  allStudents: Student[];

  constructor(private studentService: StudentService) {

    this.getAllStudents();
    this.getEnrolledStudents();

    /*
    this.studentService.find('738812').subscribe(student => {
      console.log(student);
    })
    this.studentService.create(new Student('738882', 'Biagio', 'Neri')).subscribe(student => {
      console.log(student);
    })
    this.studentService.find('738812').subscribe(student => {
      console.log(student);
    })*/
  }

  ngOnInit() {
  }

  getAllStudents() {
    this.studentService.query().subscribe(students => {
      this.allStudents = students;
      this.allStudents.sort((a, b) => Student.sortData(a, b));
    })
  }

  getEnrolledStudents() {
    this.studentService.getEnrolled().subscribe(students => {
      this.tableStudents = new MatTableDataSource<Student>(students);
    });
  }

  enrollStudent(studentFromEvent: Student) {
    this.studentService.enroll(studentFromEvent).subscribe(student => {
      if(student !== undefined) {
        // add student to tableStudents
        let tmp = this.tableStudents.data;
        this.tableStudents = new MatTableDataSource<Student>(tmp);
        this.tableStudents.data.push(student);
      } else {
        alert('Studente già iscritto al corso');
      }
    });
  }

  unrollStudents(studentsFromEvent: Student[]) {
    let tmpStudentList = [];

    this.tableStudents.data.forEach(student => {
      if(!studentsFromEvent.includes(student))
        tmpStudentList.push(student);
    })

    // unroll students
    this.studentService.unroll(studentsFromEvent).subscribe(s => {
      if(s !== undefined) {
        // update tableStudents
        this.tableStudents = new MatTableDataSource<Student>(tmpStudentList);
      }
    });
  }
}
