import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
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

  readonly MAX_FILE_SIZE = 10;

  titleControl: FormControl;
  report: Report;

  currentFileUrl: string | ArrayBuffer;
  currentFile: File;
  sizeExceeded: boolean;

  loading: boolean;
  loadingProgress = {loaded: 0, total: 100};

  constructor(private dialogRef: MatDialogRef<AddVersionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private labService: LabService,
              private mySnackBar: MySnackBarComponent) {
    this.report = data;
    this.titleControl = new FormControl(null, [Validators.required]);
  }

  ngOnInit() {
  }

  confirm() {
    if (this.titleControl.invalid)
      return;

    this.loading = true;

    const formData = new FormData();
    formData.append('title', this.titleControl.value);
    formData.append('file', this.currentFile);
    this.labService.submitVersionOnReport(this.report.id, formData).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        this.dialogRef.close(true);
      }
      if (event.type === HttpEventType.UploadProgress) {
        this.loadingProgress.loaded = event.loaded;
        this.loadingProgress.total = event.total;
      }
    }, error => {
      this.dialogRef.close(false);
    });
  }

  close() {
    this.dialogRef.close();
  }

  checkAndShowPreview(input: HTMLInputElement) {
    const file = input.files?.item(0);
    if (!file)
      return;

    this.sizeExceeded = file.size / 1048576 > this.MAX_FILE_SIZE;
    if (this.sizeExceeded) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (response) => {
      this.currentFileUrl = reader.result;
      this.currentFile = file;
    };
  }
}
