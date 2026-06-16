import { AbstractControl, ValidationErrors } from '@angular/forms';

export function projectCodeValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  if (value.startsWith('-') || value.endsWith('-')) {
    return { projectCodeHyphenEdge: true };
  }

  if (!/^[A-Z0-9-]+$/.test(value)) {
    return { projectCodePattern: true };
  }

  return null;
}
