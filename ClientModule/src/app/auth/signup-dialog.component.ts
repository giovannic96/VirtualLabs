import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog.component';
import {MustMatch} from '../helpers/must-match.validator';

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
  politoMailRegex: RegExp;
  goodPassRegex: RegExp;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.politoMailRegex = RegExp('^(([s]\\d{6}[@]studenti[.])|([d]\\d{6}[@]))polito[.]it$');
    this.goodPassRegex = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[.@$!%*?&])[A-Za-z\\d.@$!%*?&]{8,32}$');

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
      this.authService.signup(this.signupForm.get('email').value, this.signupForm.get('password').value)
        .subscribe(resp => {
          this.signupError = false;
          this.dialogRef.close(true);
        }, error => {
          this.signupError = true;
        });
    }
  }
}
