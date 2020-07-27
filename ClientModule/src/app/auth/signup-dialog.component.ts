import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css']
})
export class SignupDialogComponent implements OnInit {
  signupForm: FormGroup;
  hidePass = true;
  signupError = false;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
      // TODO add custom validator for repeat password
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
