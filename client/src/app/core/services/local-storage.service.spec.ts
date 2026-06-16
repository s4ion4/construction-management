import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('保存した値を読み取れる', () => {
    localStorage.setItem('key', JSON.stringify({ name: 'test' }));

    expect(service.get('key')).toEqual({ name: 'test' });
  });

  it('値を保存できる', () => {
    service.set('key', { name: 'test' });

    expect(localStorage.getItem('key')).toBe(JSON.stringify({ name: 'test' }));
  });

  it('保存した値を削除できる', () => {
    localStorage.setItem('key', JSON.stringify('value'));

    service.remove('key');

    expect(localStorage.getItem('key')).toBeNull();
  });
});
