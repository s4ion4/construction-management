import { TestBed } from '@angular/core/testing';
import { DepartmentList } from './department-list';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('DepartmentList', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const fixture = TestBed.createComponent(DepartmentList);
    const httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    return { fixture, httpTesting };
  }

  it('サーバーエラーが発生すると「データを読み込めませんでした」と表示される', async () => {
    const { fixture, httpTesting } = await setup();

    httpTesting
      .expectOne('api/departments')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('データを読み込めませんでした');
  });
});
