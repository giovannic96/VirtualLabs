import {Component, Input, OnInit} from '@angular/core';
import {Student} from "../../../models/student.model";
import {MatTableDataSource} from "@angular/material/table";
import {StudentService} from "../../../services/student.service";
import {core} from "@angular/compiler";
import {CourseService} from "../../../services/course.service";

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {

  tableStudents = new MatTableDataSource<Student>();
  notEnrolledStudents: Student[];

  constructor(private studentService: StudentService,
              private courseService: CourseService) {

    this.getEnrolledStudents("Mobile");
    this.getNotEnrolledStudents("Mobile");

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
    this.studentService.getAll().subscribe(students => {
      this.notEnrolledStudents = students;
      this.notEnrolledStudents.sort((a, b) => Student.sortData(a, b));
    })
  }

  getEnrolledStudents(courseName: string) {
    this.courseService.getEnrolled(courseName).subscribe(students => {
      this.tableStudents = new MatTableDataSource<Student>(students);
    });
  }

  getNotEnrolledStudents(courseName: string) {
    this.courseService.getNotEnrolled(courseName).subscribe(students => {
      this.notEnrolledStudents = students;
    });
  }

  enrollStudent(studentFromEvent: Student) {
    this.courseService.enroll(studentFromEvent).subscribe(student => {
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
    this.courseService.unroll(studentsFromEvent).subscribe(s => {
      if(s !== undefined) {
        // update tableStudents
        this.tableStudents = new MatTableDataSource<Student>(tmpStudentList);
      }
    });
  }
}
