import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ParentInvalidErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const parent = control?.parent;
    if (!parent?.invalid) {
      return false;
    }
    return parent.touched || (form?.submitted ?? false);
  }
}
