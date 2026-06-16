import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';

export interface UnsavedChangesComponent {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<UnsavedChangesComponent> = (component) => {
  const dialogService = inject(DialogService);

  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return dialogService.openActionDialog({
    title: '変更の破棄',
    message: '保存されていない変更があります。\nページを離れますか？',
    actionButtonLabel: 'ページを離れる',
    variant: 'danger',
  });
};
