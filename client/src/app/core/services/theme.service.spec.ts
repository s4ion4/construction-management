import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { LocalStorageService } from './local-storage.service';

describe('ThemeService', () => {
  function setup({ savedDarkMode = null as boolean | null } = {}) {
    const mockLocalStorageService: Pick<LocalStorageService, 'get' | 'set'> = {
      get: vi.fn().mockReturnValue(savedDarkMode),
      set: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: LocalStorageService, useValue: mockLocalStorageService }],
    });

    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    return { service };
  }

  afterEach(() => {
    document.documentElement.classList.remove('dark-mode');
  });

  describe('初期状態', () => {
    it('ダークモードの状態が保存されていればダークモードで起動する', () => {
      const { service } = setup({ savedDarkMode: true });

      expect(service.isDarkMode()).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    });

    it('ライトモードの状態が保存されていればライトモードで起動する', () => {
      const { service } = setup({ savedDarkMode: false });

      expect(service.isDarkMode()).toBe(false);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });
  });

  describe('ダークモードの切り替え', () => {
    it('ダークモードに切り替えられる', () => {
      const { service } = setup({ savedDarkMode: false });

      service.toggleDarkMode();
      TestBed.tick();

      expect(service.isDarkMode()).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    });

    it('ライトモードに切り替えられる', () => {
      const { service } = setup({ savedDarkMode: true });

      service.toggleDarkMode();
      TestBed.tick();

      expect(service.isDarkMode()).toBe(false);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });
  });
});
