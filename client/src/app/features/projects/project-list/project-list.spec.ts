import { TestBed } from '@angular/core/testing';
import { ProjectList } from './project-list';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('ProjectList', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'projects', children: [] }]),
      ],
    });

    const fixture = TestBed.createComponent(ProjectList);
    const httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    return { fixture, httpTesting };
  }

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('サーバーエラーが発生すると「データを読み込めませんでした」と表示される', async () => {
    const { fixture, httpTesting } = await setup();

    httpTesting
      .expectOne('api/projects')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('データを読み込めませんでした');
  });
});
