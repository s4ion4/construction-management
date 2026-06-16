import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProjectApiService } from '../data-access/project-api.service';

export function projectCodeUniqueValidator(
  projectApiService: ProjectApiService,
  currentProjectCode?: string,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value as string;
    if (!value) {
      return of(null);
    }
    if (control.pristine) {
      return of(null);
    }

    return timer(400).pipe(
      switchMap(() => projectApiService.checkCode(value, currentProjectCode)),
      map(() => null),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) return of({ projectCodeUnique: true });
        return of({ projectCodeCheckFailed: true });
      }),
    );
  };
}
