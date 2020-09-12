import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Utility from '../../../helpers/utility';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VmService} from '../../../services/vm.service';
import {VmModel} from '../../../models/vm-model.model';
import {Vm} from '../../../models/vm.model';

@Component({
  selector: 'app-vm-settings-dialog',
  templateUrl: './vm-settings-dialog.component.html',
  styleUrls: ['./vm-settings-dialog.component.css']
})
export class VmSettingsDialogComponent implements OnInit {

  public vmFormGroup: FormGroup;
  public formIsInvalid = false;
  public vmModel: VmModel;

  public utility: Utility;

  constructor(public dialogRef: MatDialogRef<VmSettingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private cd: ChangeDetectorRef,
              public formBuilder: FormBuilder,
              private vmService: VmService) {

    this.utility = new Utility();
  }

  ngOnInit(): void {
    this.vmFormGroup = this.formBuilder.group({
      vcpu: [0, Validators.min(1)],
      ram: [0, Validators.min(1)],
      disk: [0, Validators.min(1)]
    });

    this.vmModel = this.data.vmModel;

    /*
    if (this.data.vmExists) {

      const vm: Vm = this.data.vm;

      this.vmFormGroup.get('vcpu').setValue(vm.vcpu);
      this.vmFormGroup.get('ram').setValue(vm.ram);
      this.vmFormGroup.get('disk').setValue(vm.disk);

      this.cd.detectChanges();
    }*/
  }

  getOsImagePreview(osCode: string) {
    if (osCode)
      return this.vmService.getVmModelOsPreviewUrl(osCode);
    else
      return 'assets/other/no_os_selected.png';
  }

  checkForm() {
    if (this.vmFormGroup.invalid) {
      this.formIsInvalid = true;
      return;
    }

    //  qui faccio la richiesta e aspetto la risposta

    return; //TODO: remove when tested
    this.dialogRef.close();
  }

}
