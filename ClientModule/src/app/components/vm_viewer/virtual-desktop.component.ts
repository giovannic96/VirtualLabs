import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-virtual-desktop',
  templateUrl: './virtual-desktop.component.html',
  styleUrls: ['./virtual-desktop.component.css']
})
export class VirtualDesktopComponent implements OnInit {

  constructor(private courseService: CourseService) {
    this.courseService.hideMenu.next(true);
    this.courseService.hideMenuIcon.next(true);
  }

  ngOnInit(): void {}

}
