import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-vm-model-settings-dialog',
  templateUrl: './vm-model-settings-dialog.component.html',
  styleUrls: ['./vm-model-settings-dialog.component.css', './vm.component.css']
})
export class VmModelSettingsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VmModelSettingsDialogComponent>) { }

  ngOnInit(): void {
  }

  calcDiskLabel(value: number) {
    if (value < 1024)
      return value + ' GB';
    else if (value % 1024)
      return (value / 1024).toFixed(1) + ' TB';
    else
      return (value / 1024) + ' TB';
  }

}
