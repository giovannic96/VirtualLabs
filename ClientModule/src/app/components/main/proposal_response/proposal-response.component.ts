import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-proposal-response',
  templateUrl: './proposal-response.component.html',
  styleUrls: ['./proposal-response.component.css']
})
export class ProposalResponseComponent implements OnInit {

  requestSent: boolean;

  action: string;
  tpId: string;
  token: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.tpId = this.activatedRoute.snapshot.queryParamMap.get('tpId');
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
  }

  sendRequest() {
    this.notificationService.responseToProposal(this.action, this.tpId, this.token).subscribe(() => {
      this.requestSent = true;
    });
  }

}
