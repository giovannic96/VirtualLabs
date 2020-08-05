import { Routes } from '@angular/router';
import {HomeComponent} from './components/main/home/home.component';
import {AuthGuard} from './auth/auth.guard';
import {PageNotFoundComponent} from './components/main/pagenotfound.component';
import {VmComponent} from './components/tabs/vms/vm.component';
import {StudentsComponent} from './components/tabs/students/students.component';
import {TeamComponent} from './components/tabs/teams/team.component';
import {CourseInfoComponent} from './components/tabs/info/course-info.component';
import {PersonalComponent} from './components/main/personal/personal.component';
import {Component} from '@angular/core';
import {LabComponent} from './components/tabs/labs/lab.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'courses', component: PersonalComponent},
  {path: 'courses/:courseName', component: PersonalComponent, children: [
      {path: '', redirectTo: 'info', pathMatch: 'full'},
      {path: 'students', component: StudentsComponent},
      {path: 'vms', component: VmComponent},
      {path: 'labs', component: LabComponent},
      {path: 'teams', component: TeamComponent},
      {path: 'info', component: CourseInfoComponent}]},
  {path: '**', component: PageNotFoundComponent}
];
