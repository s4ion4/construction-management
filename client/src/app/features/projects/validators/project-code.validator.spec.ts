import { FormControl } from '@angular/forms';
import { projectCodeValidator } from './project-code.validator';

describe('projectCodeValidator', () => {
  it('未入力のときエラーにならない', () => {
    expect(projectCodeValidator(new FormControl(''))).toBeNull();
  });

  it('大文字英数字とハイフンの組み合わせのときエラーにならない', () => {
    expect(projectCodeValidator(new FormControl('ABC-123'))).toBeNull();
  });

  it('先頭がハイフンのときエラーになる', () => {
    expect(projectCodeValidator(new FormControl('-ABC'))).toEqual({ projectCodeHyphenEdge: true });
  });

  it('末尾がハイフンのときエラーになる', () => {
    expect(projectCodeValidator(new FormControl('ABC-'))).toEqual({ projectCodeHyphenEdge: true });
  });

  it('小文字が含まれるときエラーになる', () => {
    expect(projectCodeValidator(new FormControl('abc'))).toEqual({ projectCodePattern: true });
  });

  it('記号が含まれるときエラーになる', () => {
    expect(projectCodeValidator(new FormControl('ABC_123'))).toEqual({ projectCodePattern: true });
  });

  it('スペースが含まれるときエラーになる', () => {
    expect(projectCodeValidator(new FormControl('ABC 123'))).toEqual({ projectCodePattern: true });
  });

  it('全角文字が含まれるときエラーになる', () => {
    expect(projectCodeValidator(new FormControl('ＡＢＣ'))).toEqual({ projectCodePattern: true });
  });
});
