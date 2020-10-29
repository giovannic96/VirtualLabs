import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Utility from '../utility';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VmService} from '../../services/vm.service';
import {VmModel} from '../../models/vm-model.model';
import {Vm} from '../../models/vm.model';
import {TeamService} from '../../services/team.service';
import {MessageType, MySnackBarComponent} from '../my-snack-bar.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-vm-settings-dialog',
  templateUrl: './vm-settings-dialog.component.html',
  styleUrls: ['./vm-settings-dialog.component.css']
})
export class VmSettingsDialogComponent implements OnInit, OnDestroy {

  public vmFormGroup: FormGroup;
  public formIsInvalid = false;
  public formUnchanged = true;
  public originalFormValue: string;
  public vmModel: VmModel;

  private subscriptions: Subscription;
  public utility: Utility;

  constructor(public dialogRef: MatDialogRef<VmSettingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private cd: ChangeDetectorRef,
              public formBuilder: FormBuilder,
              private vmService: VmService,
              private teamService: TeamService,
              private mySnackBar: MySnackBarComponent) {

    this.subscriptions = new Subscription();
    this.utility = new Utility();
  }

  ngOnInit(): void {
    this.vmFormGroup = this.formBuilder.group({
      vcpu: [0, Validators.min(1)],
      ram: [0, Validators.min(1)],
      disk: [0, Validators.min(1)],
      allOwners: false
    });

    this.vmModel = this.data.vmModel;

    if (this.data.vmExists) {

      const vm: Vm = this.data.vm;

      this.vmFormGroup.get('vcpu').setValue(vm.vcpu);
      this.vmFormGroup.get('ram').setValue(vm.ram);
      this.vmFormGroup.get('disk').setValue(vm.disk);

      this.cd.detectChanges();

      this.originalFormValue = JSON.stringify(this.vmFormGroup.value);
      this.subscriptions.add(
        this.vmFormGroup.valueChanges.subscribe(() =>
          this.formUnchanged = JSON.stringify(this.vmFormGroup.value) === this.originalFormValue
        ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

    const vm: Vm = new Vm();
    vm.vcpu = this.vmFormGroup.get('vcpu').value;
    vm.ram = this.vmFormGroup.get('ram').value;
    vm.disk = this.vmFormGroup.get('disk').value;
    const allOwners = this.vmFormGroup.get('allOwners').value;

    if (this.data.vmExists) {
      this.vmService.editVm(this.data.vm.id, vm.getDTO()).subscribe(() => {
        this.mySnackBar.openSnackBar('Vm edited successfully', MessageType.SUCCESS, 3);

        this.data.vm.vcpu = vm.vcpu;
        this.data.vm.ram = vm.ram;
        this.data.vm.disk = vm.disk;

        this.dialogRef.close(this.data.vm);
      }, () =>
        this.mySnackBar.openSnackBar('Vm edit failed', MessageType.ERROR, 5)
      );
    } else {
      this.teamService.createVm(this.data.teamId, vm.getDTO(), allOwners.toString()).subscribe(newVm => {
          this.mySnackBar.openSnackBar('Vm created successfully', MessageType.SUCCESS, 3);
          this.dialogRef.close(newVm);
        }, () =>
          this.mySnackBar.openSnackBar('Vm creation failed', MessageType.ERROR, 5)
        );
    }
  }

}
