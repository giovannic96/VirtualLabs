import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentsComponent } from './components/tabs/students/students.component';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing-module';
import { HomeComponent } from './components/main/home/home.component';
import { PersonalComponent } from './components/main/personal/personal.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { VmComponent } from './components/tabs/vms/vm.component';
import { LabComponent } from './components/tabs/labs/lab.component';
import { TeamComponent } from './components/tabs/teams/team.component';
import { CourseInfoComponent } from './components/tabs/info/course-info.component';
import { SignupDialogComponent } from './auth/signup-dialog.component';
import { ProfileComponent } from './auth/profile.component';
import { PageNotFoundComponent } from './components/main/pagenotfound.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MySnackBarComponent } from './helpers/my-snack-bar.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { VmModelSettingsDialogComponent } from './components/tabs/vms/vm-model-settings-dialog.component';
import { MyDialogComponent } from './helpers/dialog/my-dialog.component';
import { EmailDialogComponent } from './helpers/dialog/email-dialog.component';
import { VersionDialogComponent } from './helpers/dialog/version-dialog.component';
import { GradeDialogComponent } from './helpers/dialog/grade-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { ExtendedModule, FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { VirtualDesktopComponent } from './components/vm_viewer/virtual-desktop.component';
import { VmInfoDialogComponent } from './components/vm_viewer/vm-info-dialog.component';
import { GradeNumberDirective } from './helpers/grade-number.directive';
import { VarDirective } from './helpers/ng-var.directive';
import { AssignmentDialogComponent } from './helpers/dialog/assignment-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CanvasComponent } from './helpers/canvas.component';
import { ColorCircleModule } from 'ngx-color/circle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddVersionDialogComponent } from './helpers/dialog/add-version-dialog.component';
import { TeamProposalDialogComponent } from './helpers/dialog/team-proposal-dialog.component';
import { ViewTeamProposalDialogComponent } from './helpers/dialog/view-team-proposal-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProposalResponseComponent } from './components/main/proposal_response/proposal-response.component';
import {MatRadioModule} from '@angular/material/radio';
import { VmSettingsDialogComponent } from './components/tabs/vms/vm-settings-dialog.component';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    PersonalComponent,
    StudentsComponent,
    HomeComponent,
    LoginDialogComponent,
    VmComponent,
    LabComponent,
    TeamComponent,
    CourseInfoComponent,
    SignupDialogComponent,
    ProfileComponent,
    PageNotFoundComponent,
    MySnackBarComponent,
    VmModelSettingsDialogComponent,
    MyDialogComponent,
    EmailDialogComponent,
    VirtualDesktopComponent,
    EmailDialogComponent,
    VersionDialogComponent,
    GradeDialogComponent,
    TeamProposalDialogComponent,
    ViewTeamProposalDialogComponent,
    AddVersionDialogComponent,
    VmInfoDialogComponent,
    AssignmentDialogComponent,
    GradeNumberDirective,
    VarDirective,
    CanvasComponent,
    ProposalResponseComponent,
    VmSettingsDialogComponent,
  ],
  imports: [
    RouterModule.forRoot(routes, {enableTracing: false}),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatSliderModule,
    MatChipsModule,
    FlexLayoutModule,
    FlexModule,
    ExtendedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ColorCircleModule,
    MatTooltipModule,
    DragDropModule,
    ScrollingModule,
    MatProgressBarModule,
    MatRadioModule,
    MatMenuModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    MySnackBarComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    MyDialogComponent,
    LoginDialogComponent,
    SignupDialogComponent,
    EmailDialogComponent,
    VersionDialogComponent,
    GradeDialogComponent,
    AddVersionDialogComponent,
    TeamProposalDialogComponent,
    ViewTeamProposalDialogComponent,
    VmModelSettingsDialogComponent,
    VmInfoDialogComponent,
    AssignmentDialogComponent,
    VmSettingsDialogComponent
  ]
})
export class AppModule { }
