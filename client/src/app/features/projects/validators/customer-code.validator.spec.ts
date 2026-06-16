import { FormControl } from '@angular/forms';
import { customerCodeValidator } from './customer-code.validator';

describe('customerCodeValidator', () => {
  it('未入力のときエラーにならない', () => {
    expect(customerCodeValidator(new FormControl(''))).toBeNull();
  });

  it('大文字英数字のみのときエラーにならない', () => {
    expect(customerCodeValidator(new FormControl('ABC123'))).toBeNull();
  });

  it('小文字が含まれるときエラーになる', () => {
    expect(customerCodeValidator(new FormControl('abc'))).toEqual({ customerCodePattern: true });
  });

  it('記号が含まれるときエラーになる', () => {
    expect(customerCodeValidator(new FormControl('ABC-123'))).toEqual({
      customerCodePattern: true,
    });
  });

  it('スペースが含まれるときエラーになる', () => {
    expect(customerCodeValidator(new FormControl('ABC 123'))).toEqual({
      customerCodePattern: true,
    });
  });

  it('全角文字が含まれるときエラーになる', () => {
    expect(customerCodeValidator(new FormControl('ＡＢＣ'))).toEqual({ customerCodePattern: true });
  });
});
