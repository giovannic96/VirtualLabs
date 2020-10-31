import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog.component';
import {MustMatch} from '../must-match.validator';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css']
})
export class SignupDialogComponent implements OnInit {
  signupForm: FormGroup;
  hidePass = true;
  hideRepeatPass = true;
  signupError = false;
  loading: boolean;
  politoMailRegex: RegExp;
  goodPassRegex: RegExp;
  requestComplete: boolean;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<LoginDialogComponent>) {

    // TODO: polito mail regex
    this.politoMailRegex = RegExp('^(([s]\\d{6}[@]studenti[.])|([d]\\d{6}[@]))polito[.]it$');
    this.goodPassRegex = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[.@$!%*?&])[A-Za-z\\d.@$!%*?&]{8,32}$');
    // this.politoMailRegex = RegExp('^[\\s\\S]*$');
    // this.goodPassRegex = RegExp('^[\\s\\S]*$');

    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.politoMailRegex)]],
      password: ['', [Validators.required,
                      Validators.pattern(this.goodPassRegex)]],
      repeatPassword: ['', [Validators.required,
                            Validators.pattern(this.goodPassRegex)]]
    }, {
      validators: MustMatch('password', 'repeatPassword')
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.signupForm.valid) {
      this.signupError = false;
      this.requestComplete = false;
      this.loading = true;
      this.authService.signup(this.signupForm.get('email').value, this.signupForm.get('password').value).pipe(
        timeout(5000)
      ).subscribe(resp => {
          this.requestComplete = true;
        }, error => {
          this.signupError = true;
        }).add(() => this.loading = false);
    }
  }

  close(value?: boolean) {
    this.dialogRef.close(value);
  }
}
