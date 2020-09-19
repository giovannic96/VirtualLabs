import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export function MinLowerThanMax(minControlName: string, maxControlName: string): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors => {
    const minControl = formGroup.controls[minControlName];
    const maxControl = formGroup.controls[maxControlName];

    if (maxControl.errors && !maxControl.errors.minLowerThanMax) {
      // return if another validator has already found an error on the maxControl
      return;
    }

    // set error on maxControl if validation fails
    if (minControl.value > maxControl.value) {
      maxControl.setErrors({ minLowerThanMax: true });
    } else {
      maxControl.setErrors(null);
    }
  };
}
