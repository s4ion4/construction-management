import { effect, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const DARK_MODE_KEY = 'dark-mode';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly localStorageService = inject(LocalStorageService);

  private readonly _isDarkMode = signal<boolean>(
    this.localStorageService.get<boolean>(DARK_MODE_KEY) ??
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
  );

  readonly isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    effect(() => {
      const isDark = this._isDarkMode();
      this.applyTheme(isDark);
      this.localStorageService.set(DARK_MODE_KEY, isDark);
    });
  }

  toggleDarkMode(): void {
    this._isDarkMode.update((isDark) => !isDark);
  }

  private applyTheme(isDark: boolean): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode('*,*::before,*::after{transition:none!important}'));
    document.head.appendChild(style);

    document.documentElement.classList.toggle('dark-mode', isDark);

    void window.getComputedStyle(document.body).opacity;
    document.head.removeChild(style);
  }
}
