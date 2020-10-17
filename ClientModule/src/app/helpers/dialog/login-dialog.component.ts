import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  hidePass = true;
  loginError = false;
  loading: boolean;
  errorMessage: string;

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
      this.loginError = false;
      this.loading = true;
      this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).pipe(
        timeout(5000)
      ).subscribe(resp => {
        try {
          const userParsed = JSON.parse(atob(resp.auth_token.split('.')[1]));
          this.authService.setUserTokenLogged(userParsed);
          localStorage.setItem('auth_token', resp.auth_token);
          localStorage.setItem('refresh_token', resp.refresh_token);
          this.dialogRef.close(true);
        } catch (ex) {
          this.errorMessage = 'Server error. Please contact the administrator.';
        }
      }, error => {
        this.errorMessage = 'Wrong email or password';
      }).add(() => {
        this.loginError = true;
        this.loading = false;
      });
    }
  }

}
