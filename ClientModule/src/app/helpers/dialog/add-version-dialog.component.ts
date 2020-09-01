import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Version} from '../../models/version.model';
import {LabService} from '../../services/lab.service';
import {Report} from '../../models/report.model';
import {MessageType, MySnackBarComponent} from '../my-snack-bar.component';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-add-version-dialog',
  templateUrl: 'add-version-dialog.component.html',
  styleUrls: ['./add-version-dialog.component.css']
})
export class AddVersionDialogComponent implements OnInit {

  titleControl: FormControl;
  report: Report;

  currentFileUrl: string | ArrayBuffer;
  currentFile: File;

  loading: boolean;
  loadingProgress = {loaded: 0, total: 100};

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddVersionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private labService: LabService,
              private mySnackBar: MySnackBarComponent) {
    this.report = data;
    this.titleControl = new FormControl(null, [Validators.required]);
  }

  ngOnInit() {
  }

  confirm() {
    this.loading = true;

    const formData = new FormData();
    formData.append('title', this.titleControl.value);
    formData.append('file', this.currentFile);
    this.labService.submitVersionOnReport(this.report.id, formData).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        this.mySnackBar.openSnackBar('Version submitted successfully', MessageType.SUCCESS, 3);
        setTimeout(() => this.dialogRef.close(true), 3000);
      }
      if (event.type === HttpEventType.UploadProgress) {
        this.loadingProgress.loaded = event.loaded;
        this.loadingProgress.total = event.total;
      }
    }, error => {
      this.mySnackBar.openSnackBar('Error while submitting new version', MessageType.ERROR, 3);
      this.dialogRef.close(false);
    });
  }

  close() {
    this.dialogRef.close();
  }

  showPreview(input: HTMLInputElement) {
    const file = input.files?.item(0);
    if (!file)
      return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (response) => {
      this.currentFileUrl = reader.result;
      this.currentFile = file;
    };
  }
}
