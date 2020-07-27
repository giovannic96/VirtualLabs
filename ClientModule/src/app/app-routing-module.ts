import { Routes } from '@angular/router';
import {HomeComponent} from './components/home.component';
import {AuthGuard} from './auth/auth.guard';
import {PageNotFoundComponent} from './components/pagenotfound.component';
import {VmComponent} from './components/tabs/vms/vm.component';
import {StudentsComponent} from './components/tabs/students/students.component';
import {TeamComponent} from './components/tabs/teams/team.component';
import {CourseInfoComponent} from './components/tabs/courses/course-info.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'courses', canActivate: [AuthGuard], children: [
      {path: ':courseName/students', component: StudentsComponent},
      {path: ':courseName/vms', component: VmComponent},
      {path: ':courseName/teams', component: TeamComponent},
      {path: ':courseName/courseInfo', component: CourseInfoComponent}]},
  {path: '**', component: PageNotFoundComponent}
];
