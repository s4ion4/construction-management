import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Button } from '../../button/button/button';
import { Icon } from '../../icon/icon';
import { ColumnSetting, ColumnSettingsDialogResult } from './column-settings.type';
import { DialogService } from '../../../services/dialog.service';

const VISIBLE_LIST_ID = 'column-settings-visible-list';
const HIDDEN_LIST_ID = 'column-settings-hidden-list';

@Component({
  selector: 'app-column-settings-dialog',
  imports: [MatDialogModule, CdkDropList, CdkDrag, Button, Icon],
  templateUrl: './column-settings-dialog.html',
  styleUrl: './column-settings-dialog.scss',
})
export class ColumnSettingsDialog {
  private readonly data = inject<readonly ColumnSetting[]>(MAT_DIALOG_DATA);
  private readonly dialogRef =
    inject<MatDialogRef<ColumnSettingsDialog, ColumnSettingsDialogResult>>(MatDialogRef);
  private readonly dialogService = inject(DialogService);

  protected readonly visibleListId = VISIBLE_LIST_ID;
  protected readonly hiddenListId = HIDDEN_LIST_ID;
  protected readonly connectedLists = [VISIBLE_LIST_ID, HIDDEN_LIST_ID];

  protected readonly pinnedColumns = signal<ColumnSetting[]>(
    this.data.filter((c) => c.visible && c.pinned !== null).map((c) => ({ ...c })),
  );
  protected readonly visibleColumns = signal<ColumnSetting[]>(
    this.data.filter((c) => c.visible && c.pinned === null).map((c) => ({ ...c })),
  );
  protected readonly hiddenColumns = signal<ColumnSetting[]>(
    this.data.filter((c) => !c.visible).map((c) => ({ ...c })),
  );

  protected onDrop(event: CdkDragDrop<ColumnSetting[]>): void {
    if (event.previousContainer === event.container) {
      const list = [...event.container.data];
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      this.setListById(event.container.id, list);
      return;
    }

    const fromList = [...event.previousContainer.data];
    const toList = [...event.container.data];
    transferArrayItem(fromList, toList, event.previousIndex, event.currentIndex);
    this.setListById(event.previousContainer.id, fromList);
    this.setListById(event.container.id, toList);
  }

  protected onApply(): void {
    const settings: readonly ColumnSetting[] = [
      ...this.pinnedColumns().map((c) => ({ ...c, visible: true })),
      ...this.visibleColumns().map((c) => ({ ...c, visible: true })),
      ...this.hiddenColumns().map((c) => ({ ...c, visible: false })),
    ];
    this.dialogRef.close({ action: 'apply', settings });
  }

  protected onReset(): void {
    this.dialogService
      .openActionDialog({
        title: '列の表示設定をリセットしますか？',
        message: '表示状態・並び順・列幅・ピン留め・ソートの設定が初期設定に戻ります。',
        actionButtonLabel: '初期設定に戻す',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.dialogRef.close({ action: 'reset' });
        }
      });
  }

  private setListById(listId: string, list: ColumnSetting[]) {
    if (listId === VISIBLE_LIST_ID) {
      this.visibleColumns.set(list);
    } else {
      this.hiddenColumns.set(list);
    }
  }
}
