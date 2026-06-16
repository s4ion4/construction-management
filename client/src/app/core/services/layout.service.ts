import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LocalStorageService } from './local-storage.service';

const SIDE_NAV_COLLAPSED_KEY = 'side-nav-collapsed';
const DESKTOP_BREAKPOINT = '(min-width: 768px)';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly _sideNavCollapsed = signal<boolean>(
    this.localStorageService.get<boolean>(SIDE_NAV_COLLAPSED_KEY) ?? false,
  );
  private readonly _drawerOpen = signal(false);
  private readonly _drawerAnimating = signal(false);

  readonly sideNavCollapsed = this._sideNavCollapsed.asReadonly();
  readonly drawerOpen = this._drawerOpen.asReadonly();
  readonly drawerAnimating = this._drawerAnimating.asReadonly();

  constructor() {
    this.breakpointObserver
      .observe(DESKTOP_BREAKPOINT)
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        if (matches) {
          this._drawerOpen.set(false);
          this._drawerAnimating.set(false);
        } else {
          this._sideNavCollapsed.set(true);
          this.localStorageService.set(SIDE_NAV_COLLAPSED_KEY, true);
        }
      });
  }

  toggleSideNavCollapse(): void {
    this._sideNavCollapsed.update((collapsed) => !collapsed);
    this.localStorageService.set(SIDE_NAV_COLLAPSED_KEY, this._sideNavCollapsed());
  }

  openDrawer(): void {
    if (this._drawerOpen()) return;
    this._drawerAnimating.set(true);
    this._drawerOpen.set(true);
  }

  closeDrawer(): void {
    if (!this._drawerOpen()) return;
    this._drawerAnimating.set(true);
    this._drawerOpen.set(false);
  }

  endDrawerAnimation(): void {
    this._drawerAnimating.set(false);
  }
}
