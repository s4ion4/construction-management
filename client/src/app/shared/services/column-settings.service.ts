import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColumnState } from 'ag-grid-community';
import { DataGrid } from '../components/data-grid/data-grid/data-grid';
import { ColumnSettingsDialog } from '../components/data-grid/column-settings/column-settings-dialog';
import {
  ColumnSetting,
  ColumnSettingsDialogResult,
} from '../components/data-grid/column-settings/column-settings.type';

@Injectable({
  providedIn: 'root',
})
export class ColumnSettingsService {
  private readonly matDialog = inject(MatDialog);

  open<T>(dataGrid: DataGrid<T>): void {
    const settings = this.toColumnSettings(dataGrid.getColumnState(), dataGrid.getColumnDefs());

    this.matDialog
      .open<ColumnSettingsDialog, readonly ColumnSetting[], ColumnSettingsDialogResult>(
        ColumnSettingsDialog,
        {
          width: '600px',
          maxHeight: '90dvh',
          data: settings,
        },
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;

        if (result.action === 'apply') {
          dataGrid.applyColumnState(this.toColumnState(result.settings));
        } else {
          dataGrid.resetColumnState();
        }
      });
  }

  private toColumnSettings(
    state: readonly ColumnState[],
    defs: readonly ColDef[],
  ): readonly ColumnSetting[] {
    const defByColId = new Map<string, ColDef>(
      defs
        .filter((def): def is ColDef & { colId: string } => def.colId !== undefined)
        .map((def) => [def.colId, def]),
    );

    return state
      .filter((s) => {
        const def = defByColId.get(s.colId);
        return def !== undefined && def.headerName !== undefined;
      })
      .map((s) => ({
        key: s.colId,
        label: defByColId.get(s.colId)!.headerName!,
        visible: !s.hide,
        pinned: s.pinned === true ? 'left' : s.pinned === false ? null : (s.pinned ?? null),
      }));
  }

  private toColumnState(settings: readonly ColumnSetting[]): ColumnState[] {
    return settings.map((s) => ({
      colId: s.key,
      hide: !s.visible,
      pinned: s.pinned,
    }));
  }
}
