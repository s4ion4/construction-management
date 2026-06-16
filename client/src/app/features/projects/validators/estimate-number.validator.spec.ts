import { FormGroup, FormControl } from '@angular/forms';
import { estimateNumberValidator } from './estimate-number.validator';

function createGroup(mainNumber: string, branchNumber: string): FormGroup {
  return new FormGroup({
    mainNumber: new FormControl(mainNumber),
    branchNumber: new FormControl(branchNumber),
  });
}

describe('estimateNumberValidator', () => {
  it('主番号も枝番号も未入力のときエラーにならない', () => {
    expect(estimateNumberValidator(createGroup('', ''))).toBeNull();
  });

  it('主番号と枝番号が正しく入力されているときエラーにならない', () => {
    expect(estimateNumberValidator(createGroup('123456', '01'))).toBeNull();
  });

  it('主番号のみ入力されているときエラーになる', () => {
    expect(estimateNumberValidator(createGroup('123456', ''))).toEqual({
      estimateNumberIncomplete: true,
    });
  });

  it('枝番号のみ入力されているときエラーになる', () => {
    expect(estimateNumberValidator(createGroup('', '01'))).toEqual({
      estimateNumberIncomplete: true,
    });
  });

  it('主番号が6桁でないときエラーになる', () => {
    expect(estimateNumberValidator(createGroup('12345', '01'))).toEqual({
      estimateNumberMainFormat: true,
    });
  });

  it('主番号に数字以外が含まれるときエラーになる', () => {
    expect(estimateNumberValidator(createGroup('12345A', '01'))).toEqual({
      estimateNumberMainFormat: true,
    });
  });

  it('枝番号が2桁でないときエラーになる', () => {
    expect(estimateNumberValidator(createGroup('123456', '1'))).toEqual({
      estimateNumberBranchFormat: true,
    });
  });

  it('枝番号に数字以外が含まれるときエラーになる', () => {
    expect(estimateNumberValidator(createGroup('123456', 'AB'))).toEqual({
      estimateNumberBranchFormat: true,
    });
  });
});
