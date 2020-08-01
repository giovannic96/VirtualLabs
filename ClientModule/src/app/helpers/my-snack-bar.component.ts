import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export enum MessageType {
  INFO,
  SUCCESS,
  WARNING,
  ERROR
}

@Component({
  selector: 'app-snack-bar',
  template: ''
})

export class MySnackBarComponent {

  constructor(private snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, type: MessageType, durationInSeconds: number, action?: string) {
    const config: any = {};
    config.duration = durationInSeconds * 1000;
    switch (type) {
      case MessageType.INFO:
        config.panelClass = 'snackMessageInfo';
        break;
      case MessageType.SUCCESS:
        config.panelClass = 'snackMessageSuccess';
        break;
      case MessageType.WARNING:
        config.panelClass = 'snackMessageWarning';
        break;
      case MessageType.ERROR:
        config.panelClass = 'snackMessageError';
        break;
    }
    this.snackBar.open(message, action ? action : '', config);
  }
}
