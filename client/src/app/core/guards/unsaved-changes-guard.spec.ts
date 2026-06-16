import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { UnsavedChangesComponent, unsavedChangesGuard } from './unsaved-changes-guard';
import { of } from 'rxjs';
import { DialogService } from '../../shared/services/dialog.service';

describe('unsavedChangesGuard', () => {
  function setup({ hasUnsavedChanges = false } = {}) {
    const dialogServiceSpy = {
      openActionDialog: vi.fn().mockReturnValue(of(true)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: dialogServiceSpy }],
    });

    const component: UnsavedChangesComponent = {
      hasUnsavedChanges: vi.fn().mockReturnValue(hasUnsavedChanges),
    };

    const executeGuard: CanDeactivateFn<UnsavedChangesComponent> = (...guardParameters) =>
      TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

    return { component, executeGuard, dialogServiceSpy };
  }

  it('未保存の変更がない場合はダイアログなしで離脱できる', () => {
    const { component, executeGuard, dialogServiceSpy } = setup({ hasUnsavedChanges: false });

    const result = executeGuard(component, null!, null!, null!);

    expect(result).toBe(true);
    expect(dialogServiceSpy.openActionDialog).not.toHaveBeenCalled();
  });

  it('未保存の変更がある場合は破棄確認ダイアログを表示する', () => {
    const { component, executeGuard, dialogServiceSpy } = setup({ hasUnsavedChanges: true });

    executeGuard(component, null!, null!, null!);

    expect(dialogServiceSpy.openActionDialog).toHaveBeenCalledWith({
      title: '変更の破棄',
      message: '保存されていない変更があります。\nページを離れますか？',
      actionButtonLabel: 'ページを離れる',
      variant: 'danger',
    });
  });
});
