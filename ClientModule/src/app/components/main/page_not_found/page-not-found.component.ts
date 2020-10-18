import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: 'page-not-found.component.html',
  styleUrls: ['page-not-found.component.css']
})
export class PageNotFoundComponent {

  constructor(private router: Router,
              private courseService: CourseService) {
    this.courseService.hideMenu.next(false);
    this.courseService.hideMenuIcon.next(true);
  }

  redirectToHome() {
    this.router.navigate(['home']);
  }
}
