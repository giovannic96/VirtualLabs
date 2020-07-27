import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Student} from '../../models/student.model';
import {StudentService} from '../../services/student.service';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/course.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-course-cont',
  templateUrl: './course-cont.component.html',
  styleUrls: ['./course-cont.component.css']
})
export class CourseContComponent implements OnInit {
  tableStudents = new MatTableDataSource<Student>();
  notEnrolledStudents: Student[];
  navLinks: any[];
  activeLinkIndex = -1;
  selectedCourse: Course;


  constructor(private studentService: StudentService,
              private courseService: CourseService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    this.courseService.getSelectedCourse().subscribe(course => {
      this.selectedCourse = course;
      if (course !== null) {
        this.getEnrolledStudents(course.name);
        this.getNotEnrolledStudents(course.name);
      }
    });

    this.navLinks = [
      {
        label: 'Students',
        path: './teacher/course/applicazioni-internet/students',
        index: 0
      }, {
        label: 'Teams',
        path: './teacher/course/applicazioni-internet/groups',
        index: 1
      }, {
        label: 'VMs',
        path: './teacher/course/applicazioni-internet/vms',
        index: 2
      },
    ];

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });

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
    });
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
      if (student !== undefined) {
        // add student to tableStudents
        const tmp = this.tableStudents.data;
        this.tableStudents = new MatTableDataSource<Student>(tmp);
        this.tableStudents.data.push(student);
      } else {
        alert('Studente già iscritto al corso');
      }
    });
  }

  unrollStudents(studentsFromEvent: Student[]) {
    const tmpStudentList = [];

    this.tableStudents.data.forEach(student => {
      if (!studentsFromEvent.includes(student))
        tmpStudentList.push(student);
    });

    // unroll students
    this.courseService.unroll(studentsFromEvent).subscribe(s => {
      if (s !== undefined) {
        // update tableStudents
        this.tableStudents = new MatTableDataSource<Student>(tmpStudentList);
      }
    });
  }
}
