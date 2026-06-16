import { TestBed } from '@angular/core/testing';
import { SessionStorageService } from './session-storage.service';

describe('SessionStorageService', () => {
  let service: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionStorageService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('保存した値を読み取れる', () => {
    sessionStorage.setItem('key', JSON.stringify({ name: 'test' }));

    expect(service.get('key')).toEqual({ name: 'test' });
  });

  it('値を保存できる', () => {
    service.set('key', { name: 'test' });

    expect(sessionStorage.getItem('key')).toBe(JSON.stringify({ name: 'test' }));
  });

  it('保存した値を削除できる', () => {
    sessionStorage.setItem('key', JSON.stringify('value'));

    service.remove('key');

    expect(sessionStorage.getItem('key')).toBeNull();
  });
});
