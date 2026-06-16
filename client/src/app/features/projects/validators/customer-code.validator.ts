import { AbstractControl, ValidationErrors } from '@angular/forms';

export function customerCodeValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  if (!/^[A-Z0-9]+$/.test(value)) {
    return { customerCodePattern: true };
  }

  return null;
}
