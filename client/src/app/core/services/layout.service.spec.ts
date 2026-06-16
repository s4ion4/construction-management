import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { LayoutService } from './layout.service';
import { LocalStorageService } from './local-storage.service';

describe('LayoutService', () => {
  function setup({ savedCollapsed = null as boolean | null } = {}) {
    const breakpointSubject = new Subject<BreakpointState>();

    const mockLocalStorageService: Pick<LocalStorageService, 'get' | 'set'> = {
      get: vi.fn().mockReturnValue(savedCollapsed),
      set: vi.fn(),
    };

    const mockBreakpointObserver: Pick<BreakpointObserver, 'observe'> = {
      observe: vi.fn().mockReturnValue(breakpointSubject.asObservable()),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    });

    const service = TestBed.inject(LayoutService);

    return { service, breakpointSubject, mockLocalStorageService };
  }

  describe('初期状態', () => {
    it('保存されている状態がなければサイドナビゲーションは展開状態になる', () => {
      const { service } = setup({ savedCollapsed: null });

      expect(service.sideNavCollapsed()).toBe(false);
    });

    it('折りたたみ済みの状態が保存されていればサイドナビゲーションは折りたたみ状態になる', () => {
      const { service } = setup({ savedCollapsed: true });

      expect(service.sideNavCollapsed()).toBe(true);
    });

    it('展開済みの状態が保存されていればサイドナビゲーションは展開状態になる', () => {
      const { service } = setup({ savedCollapsed: false });

      expect(service.sideNavCollapsed()).toBe(false);
    });
  });

  describe('サイドナビゲーションの切り替え', () => {
    it('サイドナビゲーションの状態を折りたたみに変更できる', () => {
      const { service } = setup();

      service.toggleSideNavCollapse();

      expect(service.sideNavCollapsed()).toBe(true);
    });

    it('サイドナビゲーションの状態を展開に変更できる', () => {
      const { service } = setup({ savedCollapsed: true });

      service.toggleSideNavCollapse();

      expect(service.sideNavCollapsed()).toBe(false);
    });

    it('サイドナビゲーションの切り替え時に状態が保存される', () => {
      const { service, mockLocalStorageService } = setup();

      service.toggleSideNavCollapse();

      expect(mockLocalStorageService.set).toHaveBeenCalledWith('side-nav-collapsed', true);
    });
  });

  describe('画面幅の変化への対応', () => {
    it('デスクトップ幅に変化した場合はドロワーが閉じる', () => {
      const { service, breakpointSubject } = setup();

      service.openDrawer();
      breakpointSubject.next({ matches: true, breakpoints: {} });

      expect(service.drawerOpen()).toBe(false);
    });

    it('モバイル幅に変化した場合はサイドナビゲーションが折りたたまれ、状態が保存される', () => {
      const { service, breakpointSubject, mockLocalStorageService } = setup({
        savedCollapsed: false,
      });

      breakpointSubject.next({ matches: false, breakpoints: {} });

      expect(service.sideNavCollapsed()).toBe(true);
      expect(mockLocalStorageService.set).toHaveBeenCalledWith('side-nav-collapsed', true);
    });
  });

  describe('ドロワーの開閉', () => {
    it('ドロワーを開くことができる', () => {
      const { service } = setup();

      service.openDrawer();

      expect(service.drawerOpen()).toBe(true);
    });

    it('ドロワーを閉じることができる', () => {
      const { service } = setup();

      service.openDrawer();
      service.closeDrawer();

      expect(service.drawerOpen()).toBe(false);
    });
  });
});
