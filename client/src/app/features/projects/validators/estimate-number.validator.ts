import { AbstractControl, ValidationErrors } from '@angular/forms';

export function estimateNumberValidator(group: AbstractControl): ValidationErrors | null {
  const mainNumber = group.get('mainNumber')?.value as string;
  const branchNumber = group.get('branchNumber')?.value as string;

  const hasMain = !!mainNumber;
  const hasBranch = !!branchNumber;

  if (hasMain !== hasBranch) {
    return { estimateNumberIncomplete: true };
  }

  if (hasMain && !/^\d{6}$/.test(mainNumber)) {
    return { estimateNumberMainFormat: true };
  }

  if (hasBranch && !/^\d{2}$/.test(branchNumber)) {
    return { estimateNumberBranchFormat: true };
  }

  return null;
}
