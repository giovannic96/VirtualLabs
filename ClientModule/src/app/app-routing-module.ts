import { Routes } from "@angular/router";
import {PageNotFoundComponent} from "./teacher/pagenotfound.component";
import {HomeComponent} from "./teacher/home.component";
import {StudentsContComponent} from "./teacher/students-cont.component";
import {VmsContComponent} from "./teacher/vms-cont.component";
import {AuthGuard} from "./auth/auth.guard";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'teacher/course', canActivate: [AuthGuard], children: [
      {path: 'applicazioni-internet/students', component: StudentsContComponent},
      {path: 'applicazioni-internet/vms', component: VmsContComponent}, ]},
  {path: 'teacher/course/applicazioni-internet/students', component: StudentsContComponent, canActivate: [AuthGuard]},
  {path: 'teacher/course/applicazioni-internet/vms', component: VmsContComponent, canActivate: [AuthGuard]},
  {path: '**', component: PageNotFoundComponent}
];
