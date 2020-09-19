import { Component, OnInit } from '@angular/core';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-registration-confirm',
  templateUrl: './registration-confirm.component.html',
  styleUrls: ['./registration-confirm.component.css']
})
export class RegistrationConfirmComponent implements OnInit {

  token: string;
  requestSent: boolean;
  error: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

    this.authService.confirmRegistration(this.token).pipe(
      finalize(() => this.requestSent = true)
    ).subscribe(response => {
      console.log(response);
    }, () => this.error = true);
  }

}
