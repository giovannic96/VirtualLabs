import { Routes } from "@angular/router";
import {HomeComponent} from "./components/home.component";
import {StudentsContComponent} from "./components/tabs/students/students-cont.component";
import {AuthGuard} from "./auth/auth.guard";
import {PageNotFoundComponent} from "./components/pagenotfound.component";
import {VmComponent} from "./components/tabs/vms/vm.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'teacher/course', canActivate: [AuthGuard], children: [
      {path: 'applicazioni-internet/students', component: StudentsContComponent},
      {path: 'applicazioni-internet/vms', component: VmComponent}, ]},
  {path: 'teacher/course/applicazioni-internet/students', component: StudentsContComponent, canActivate: [AuthGuard]},
  {path: 'teacher/course/applicazioni-internet/vms', component: VmComponent, canActivate: [AuthGuard]},
  {path: '**', component: PageNotFoundComponent}
];
