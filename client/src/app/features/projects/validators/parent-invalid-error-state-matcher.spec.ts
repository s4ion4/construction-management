import { FormControl, FormGroup } from '@angular/forms';
import { ParentInvalidErrorStateMatcher } from './parent-invalid-error-state-matcher';

function controlInInvalidGroup({ touched = false } = {}): FormControl {
  const control = new FormControl('');
  const group = new FormGroup({ field: control });
  group.setErrors({ customError: true });
  if (touched) {
    group.markAsTouched();
  }
  return control;
}

describe('ParentInvalidErrorStateMatcher', () => {
  const matcher = new ParentInvalidErrorStateMatcher();

  it('コントロールが存在しない場合、エラーを表示しない', () => {
    const result = matcher.isErrorState(null, null);

    expect(result).toBe(false);
  });

  it('親グループが有効な場合、エラーを表示しない', () => {
    const control = new FormControl('');
    new FormGroup({ field: control });

    const result = matcher.isErrorState(control, null);

    expect(result).toBe(false);
  });

  it('親グループが無効かつ未タッチの場合、エラーを表示しない', () => {
    const result = matcher.isErrorState(controlInInvalidGroup({ touched: false }), null);

    expect(result).toBe(false);
  });

  it('親グループが無効かつタッチ済みの場合、エラーを表示する', () => {
    const result = matcher.isErrorState(controlInInvalidGroup({ touched: true }), null);

    expect(result).toBe(true);
  });
});
