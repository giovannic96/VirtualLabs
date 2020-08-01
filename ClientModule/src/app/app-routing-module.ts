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
  {path: 'courses', component: PersonalComponent, children: [
      {path: ':courseName/students', component: StudentsComponent},
      {path: ':courseName/vms', component: VmComponent},
      {path: ':courseName/labs', component: LabComponent},
      {path: ':courseName/teams', component: TeamComponent},
      {path: ':courseName/info', component: CourseInfoComponent}]},
  {path: '**', component: PageNotFoundComponent}
];
