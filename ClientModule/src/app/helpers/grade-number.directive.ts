import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appGradeNumber]'
})
export class GradeNumberDirective {
  // allow up to two digit for the integer part and max one digit for the decimal part (number from 0 to 30)
  private regex: RegExp = new RegExp(/^(30(\.0)?|[12]?\d(\.[05])?)$/g);

  // allow key codes for special events. Reflect: Backspace, tab, end, home, arrow left, arrow right, del, delete, dot
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete', '.'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // prevent that if there is already one '.' and I want to insert another one
    if ((this.el.nativeElement.value.indexOf('.') !== -1 && event.key === '.') ||
        (this.el.nativeElement.value === '' && event.key === '.')) {
      event.preventDefault();
      return;
    }

    // allow Backspace, tab, end, home, minus, arrow left, arrow right, del, delete, dot keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: KeyboardEvent) {

    /* Change value of element according to the input value */
    if (this.el.nativeElement.value === '' || this.el.nativeElement.value === null
        || this.el.nativeElement.value === undefined) {
      this.el.nativeElement.value = '0'; // ex. '' becomes '0'
    } else if (this.el.nativeElement.value === '.') {
      this.el.nativeElement.value = '0'; // ex. '.' becomes '0'
    } else if (this.el.nativeElement.value.length === 2 && this.el.nativeElement.value.startsWith('.')) {
      this.el.nativeElement.value = '0' + this.el.nativeElement.value; // ex. '.5' becomes '0.5'
    } else if (this.el.nativeElement.value.slice(-1) === '.') {
      this.el.nativeElement.value = this.el.nativeElement.value + '0'; // ex. '28.' becomes '28.0'
    } else if (this.el.nativeElement.value.length === 2 && this.el.nativeElement.value.indexOf('.') === -1
                && this.el.nativeElement.value.startsWith('0')) {
      this.el.nativeElement.value = this.el.nativeElement.value.slice(-1); // ex. '08' becomes '8'
    } else if (this.el.nativeElement.value.indexOf('.') === -1 && (Number(this.el.nativeElement.value) < 0.0
                || Number(this.el.nativeElement.value) > 30.0)) {
      this.el.nativeElement.value = '0'; // ex. '95' becomes '0'
    } else if (this.el.nativeElement.value.length === 3 && this.el.nativeElement.value.indexOf('.') === -1) {
      if (this.el.nativeElement.value.slice(-2).startsWith('0')) {
        this.el.nativeElement.value = this.el.nativeElement.value.slice(-1); // ex. '08' becomes '8'
      } else if (Number(this.el.nativeElement.value) < 0.0 || Number(this.el.nativeElement.value) > 30.0) {
        this.el.nativeElement.value = '0'; // ex. '308' becomes '0'
      }
    } else if (this.el.nativeElement.value.length >= 3 && this.el.nativeElement.value.startsWith('.')) {
      this.el.nativeElement.value = '0'; // ex. '.95' becomes '0'
    } else if (this.el.nativeElement.value.length > 3 && this.el.nativeElement.value.indexOf('.') === -1) {
      this.el.nativeElement.value = '0'; // ex. '3008' becomes '0'
    }
  }

}
