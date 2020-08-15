import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private courseService: CourseService) {
    this.courseService.hideMenuIcon.next(true);
  }

  ngOnInit(): void {
  }

}
