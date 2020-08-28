import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-version-dialog',
  templateUrl: 'version-dialog.component.html',
  styleUrls: ['./version-dialog.component.css']
})
export class VersionDialogComponent implements OnInit {

  title: string;
  content: string;

  constructor(private dialogRef: MatDialogRef<VersionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.content = data.content;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
