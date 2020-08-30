import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {pairwise, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas {}']
})
export class CanvasComponent implements AfterViewInit {
  private _width = 200;
  private _height = 200;
  private _penColor = '#000';
  private tempCanvas: HTMLCanvasElement;

  @ViewChild('canvas') public canvas: ElementRef<HTMLCanvasElement>;

  // setting a width and height for the canvas
  @Input() public set width(value: number) {
    if (this.canvas)
      this.resizeCanvas(value, this._height);
    this._width = value;
  }

  @Input() public set height(value: number) {
    if (this.canvas)
      this.resizeCanvas(this._width, value);
    this._height = value;
  }

  @Input() public set penColor(color: string) {
    if (this.context)
      this.context.strokeStyle = color;
    this._penColor = color;
  }

  private context: CanvasRenderingContext2D;

  constructor() {
    this.tempCanvas = document.createElement('canvas');
  }

  ngAfterViewInit(): void {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.context = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this._width;
    canvasEl.height = this._height;

    // set some default properties about the line
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = this._penColor;

    // we'll implement this method to start capturing mouse events
    this.captureEvents(canvasEl);

  }

  private captureEvents(canvasElement: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasElement, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasElement, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasElement, 'mouseup')),

              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasElement, 'mouseleave')),

              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasElement.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(
    prevPos: { x: number, y: number },
    currentPos: { x: number, y: number }
  ) {
    // in case the context is not set
    if (!this.context) { return; }

    // start our drawing path
    this.context.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.context.moveTo(prevPos.x, prevPos.y); // from

      // draws a line from the start pos until the current position
      this.context.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.context.stroke();
    }
  }

  private resizeCanvas(width: number, height: number) {

    this.tempCanvas.width = width;
    this.tempCanvas.height = height;
    this.tempCanvas.getContext('2d').imageSmoothingQuality = 'high';
    this.tempCanvas.getContext('2d').drawImage(
      this.context.canvas,
      0, 0, this.context.canvas.width, this.context.canvas.height,
      0, 0, width, height
      );

    const lineWidth = this.context.lineWidth;
    const lineCap = this.context.lineCap;
    const strokeStyle = this.context.strokeStyle;

    this.context.canvas.width = width;
    this.context.canvas.height = height;

    this.context.lineWidth = lineWidth;
    this.context.lineCap = lineCap;
    this.context.strokeStyle = strokeStyle;
    this.context.imageSmoothingQuality = 'high';
    this.context.drawImage(this.tempCanvas, 0, 0);
  }
}
