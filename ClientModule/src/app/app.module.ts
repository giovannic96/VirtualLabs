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
import { MyDialogComponent } from './helpers/my-dialog.component';
import { EmailDialogComponent } from './helpers/email-dialog.component';
import { VersionDialogComponent } from './helpers/version-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { ExtendedModule, FlexLayoutModule, FlexModule } from '@angular/flex-layout';

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
    VersionDialogComponent,
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
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    MySnackBarComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginDialogComponent, EmailDialogComponent, VersionDialogComponent]
})
export class AppModule { }
