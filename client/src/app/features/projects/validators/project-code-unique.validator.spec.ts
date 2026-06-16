import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { ProjectApiService } from '../data-access/project-api.service';
import { projectCodeUniqueValidator } from './project-code-unique.validator';

describe('projectCodeUniqueValidator', () => {
  function setup({ currentProjectCode }: { currentProjectCode?: string } = {}) {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const asyncValidatorFn = projectCodeUniqueValidator(
      TestBed.inject(ProjectApiService),
      currentProjectCode,
    );
    const validatorFn = (control: FormControl): Observable<ValidationErrors | null> =>
      asyncValidatorFn(control) as Observable<ValidationErrors | null>;

    const httpTesting = TestBed.inject(HttpTestingController);

    return { validatorFn, httpTesting };
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('未入力のとき検証をスキップする', async () => {
    const { validatorFn } = setup();

    const result = await firstValueFrom(validatorFn(new FormControl('')));

    expect(result).toBeNull();
  });

  it('未変更のとき検証をスキップする', async () => {
    const { validatorFn } = setup();

    const result = await firstValueFrom(validatorFn(new FormControl('P001')));

    expect(result).toBeNull();
  });

  it('未使用の工事コードのときエラーにならない', async () => {
    const { validatorFn, httpTesting } = setup();
    const control = new FormControl('P001');
    control.markAsDirty();

    const result = firstValueFrom(validatorFn(control));
    await vi.runAllTimersAsync();
    httpTesting.expectOne('api/projects/check-code').flush(null);

    expect(await result).toBeNull();
  });

  it('すでに使われている工事コードのときエラーになる', async () => {
    const { validatorFn, httpTesting } = setup();
    const control = new FormControl('P001');
    control.markAsDirty();

    const result = firstValueFrom(validatorFn(control));
    await vi.runAllTimersAsync();
    httpTesting
      .expectOne('api/projects/check-code')
      .flush(null, { status: 409, statusText: 'Conflict' });

    expect(await result).toEqual({ projectCodeUnique: true });
  });

  it('チェック中にサーバーエラーが発生したときエラーになる', async () => {
    const { validatorFn, httpTesting } = setup();
    const control = new FormControl('P001');
    control.markAsDirty();

    const result = firstValueFrom(validatorFn(control));
    await vi.runAllTimersAsync();
    httpTesting
      .expectOne('api/projects/check-code')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(await result).toEqual({ projectCodeCheckFailed: true });
  });

  it('重複チェックは一定時間の経過後に実行される', async () => {
    const { validatorFn, httpTesting } = setup();
    const control = new FormControl('P001');
    control.markAsDirty();

    firstValueFrom(validatorFn(control));
    await vi.advanceTimersByTimeAsync(399);
    httpTesting.expectNone('api/projects/check-code');

    await vi.advanceTimersByTimeAsync(1);
    httpTesting.expectOne('api/projects/check-code');
  });
});
