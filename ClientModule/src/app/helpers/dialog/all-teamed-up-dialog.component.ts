import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: 'all-teamed-up-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.css']
})
export class AllTeamedUpDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AllTeamedUpDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
  }


}
