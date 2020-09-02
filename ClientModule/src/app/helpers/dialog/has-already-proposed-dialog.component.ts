import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: 'simple-info-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.css']
})
export class HasAlreadyProposedDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HasAlreadyProposedDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
  }


}
