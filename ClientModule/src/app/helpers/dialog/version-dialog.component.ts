import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabService} from '../../services/lab.service';
import {CanvasComponent} from '../canvas.component';
import {Version} from '../../models/version.model';
import {MySnackBarComponent} from '../my-snack-bar.component';
import Utility from '../utility';

@Component({
  selector: 'app-version-dialog',
  templateUrl: 'version-dialog.component.html',
  styleUrls: ['./version-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionDialogComponent implements OnInit {
  reviewInProgress: boolean;
  reviewIsHidden: boolean;

  version: Version;
  isLastVersion: boolean;
  isVersionRevisable: boolean;

  gradeAfterReview = true;

  @ViewChild('appCanvas') canvasComponent: CanvasComponent;
  @ViewChild('review') review: ElementRef<HTMLImageElement>;

  public colors: string[] = ['#000', '#9c27b0', '#3f51b5', '#03a9f4', '#009688',
                            '#8bc34a', '#ffeb3b', '#ff9800', '#795548', '#f44336', '#fff'];
  public currentColor;

  constructor(private dialogRef: MatDialogRef<VersionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

    this.version = data.version;
    this.isLastVersion = data.isLast;
    this.isVersionRevisable = data.isRevisable;

    this.currentColor = this.colors[0];
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  changePenColor(event) {
    this.currentColor = event.color.hex;
  }

  resetCanvas() {
    const canvas = this.canvasComponent.canvas.nativeElement;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  closeAndSubmit() {
    const canvas = this.canvasComponent.canvas.nativeElement;
    const data = {
      versionId: this.version.id,
      reviewImage: canvas.toDataURL().split(',')[1],
      gradeAfter: this.gradeAfterReview
    };
    this.dialogRef.close(data);
  }

  toggleReview() {
    this.reviewIsHidden = !this.reviewIsHidden;
  }

  max(v1: number, v2: number): number {
    return v1 > v2 ? v1 : v2;
  }

  currentTimestamp() {
    return Date.now();
  }

}
