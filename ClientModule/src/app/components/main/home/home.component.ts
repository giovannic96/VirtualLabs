import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  desktopAppLink = 'https://virtuallabs.ns0.it/installers/VirtualLabs-x64-setup.exe';

  constructor(private authService: AuthService,
              private courseService: CourseService) {
    this.courseService.hideMenu.next(false);
    this.courseService.hideMenuIcon.next(true);
  }

  ngOnInit(): void {
  }

}
