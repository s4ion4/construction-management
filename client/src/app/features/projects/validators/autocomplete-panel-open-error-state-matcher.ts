import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

// GitHub Issue: https://github.com/angular/components/issues/18313
export class AutocompletePanelOpenErrorStateMatcher implements ErrorStateMatcher {
  constructor(private readonly isPanelOpen: () => boolean) {}

  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (this.isPanelOpen()) {
      return false;
    }
    const invalid = control?.invalid ?? false;
    return invalid && ((control?.touched ?? false) || (form?.submitted ?? false));
  }
}
