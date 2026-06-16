import { FormControl } from '@angular/forms';
import { AutocompletePanelOpenErrorStateMatcher } from './autocomplete-panel-open-error-state-matcher';

function setup({ isPanelOpen = false } = {}) {
  const matcher = new AutocompletePanelOpenErrorStateMatcher(() => isPanelOpen);
  return { matcher };
}

function invalidTouchedControl(): FormControl {
  const control = new FormControl('');
  control.setErrors({ required: true });
  control.markAsTouched();
  return control;
}

describe('AutocompletePanelOpenErrorStateMatcher', () => {
  it('オートコンプリートのパネルが開いている間はエラーを表示しない', () => {
    const { matcher } = setup({ isPanelOpen: true });

    const result = matcher.isErrorState(invalidTouchedControl(), null);

    expect(result).toBe(false);
  });

  it('コントロールが存在しない場合、エラーを表示しない', () => {
    const { matcher } = setup();

    const result = matcher.isErrorState(null, null);

    expect(result).toBe(false);
  });

  it('コントロールが有効な場合、エラーを表示しない', () => {
    const { matcher } = setup();
    const control = new FormControl('');
    control.markAsTouched();

    const result = matcher.isErrorState(control, null);

    expect(result).toBe(false);
  });

  it('コントロールが無効かつ未タッチの場合、エラーを表示しない', () => {
    const { matcher } = setup();
    const control = new FormControl('');
    control.setErrors({ required: true });

    const result = matcher.isErrorState(control, null);

    expect(result).toBe(false);
  });

  it('コントロールが無効かつタッチ済みの場合、エラーを表示する', () => {
    const { matcher } = setup();

    const result = matcher.isErrorState(invalidTouchedControl(), null);

    expect(result).toBe(true);
  });
});
