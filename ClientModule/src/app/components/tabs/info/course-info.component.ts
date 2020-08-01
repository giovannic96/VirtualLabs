import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Student} from '../../../models/student.model';
import {Course} from '../../../models/course.model';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  ngOnInit(): void {
  }

}
