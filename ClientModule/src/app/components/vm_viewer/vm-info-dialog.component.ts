import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Vm} from '../../models/vm.model';
import {VmService} from '../../services/vm.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-vm-settings-dialog',
  templateUrl: './vm-info-dialog.component.html',
  styleUrls: ['./vm-info-dialog.component.css']
})
export class VmInfoDialogComponent implements OnInit {

  public osMap: Map<string, string>;

  constructor(public dialogRef: MatDialogRef<VmInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private vmService: VmService) {

    this.vmService.getOsMap().subscribe( map => this.osMap = new Map(Object.entries(map)));
  }

  ngOnInit(): void {
  }

  getVmModelLogo() {
    return this.vmService.getVmModelOsLogoUrl(this.data.vmModel.os);
  }
}
