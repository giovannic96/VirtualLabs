import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TeamProposal} from '../../models/team-proposal.model';
import Utility from '../utility';

@Component({
  selector: 'app-view-team-proposal-dialog',
  templateUrl: 'view-team-proposal-dialog.component.html',
  styleUrls: ['./view-team-proposal-dialog.component.css'],
})
export class ViewTeamProposalDialogComponent implements OnInit {

  public utility: Utility;

  proposal: TeamProposal;

  constructor(private dialogRef: MatDialogRef<ViewTeamProposalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.proposal = data.proposal;
    this.utility = new Utility();
  }

  ngOnInit() {
  }

  confirm() {
    const data = {
      confirmed: true
    };
    this.dialogRef.close(data);
  }

  reject() {
    const data = {
      confirmed: false
    };
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

}
