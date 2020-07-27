import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user.model';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  hidePass = true;
  loginError = false;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe(resp => {
        localStorage.setItem('tokenLab5', resp.accessToken);
        const userParsed = JSON.parse(atob(resp.accessToken.split('.')[1]));
        this.authService.setUserLogged(userParsed);
        this.loginError = false;
        this.dialogRef.close(true);
      }, error => {
        this.loginError = true;
      });
    }
  }

}
