import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { ColDef, ColumnState } from 'ag-grid-community';
import { vi } from 'vitest';
import { ColumnSettingsService } from './column-settings.service';
import { DataGrid } from '../components/data-grid/data-grid/data-grid';
import { ButtonHarness } from '../testing/button-harness';

@Component({ template: '' })
class HostComponent {}

const columnDef = (colId: string, headerName?: string): ColDef => ({ colId, headerName });

const columnState = (colId: string, overrides: Partial<ColumnState> = {}): ColumnState => ({
  colId,
  hide: false,
  pinned: null,
  ...overrides,
});

const dataGridStub = (state: ColumnState[] = [], defs: ColDef[] = []) =>
  ({
    getColumnState: () => state,
    getColumnDefs: () => defs,
    applyColumnState: vi.fn(),
    resetColumnState: vi.fn(),
  }) as unknown as DataGrid<unknown>;

describe('ColumnSettingsService', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    });

    const service = TestBed.inject(ColumnSettingsService);
    const fixture = TestBed.createComponent(HostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return { service, rootLoader };
  }

  it('設定を適用すると列の状態がデータグリッドに反映される', async () => {
    const { service, rootLoader } = setup();
    const dataGrid = dataGridStub(
      [columnState('name'), columnState('customer', { hide: true })],
      [columnDef('name', '工事名'), columnDef('customer', '得意先')],
    );

    service.open(dataGrid);

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    const applyButton = await dialog.getHarness(ButtonHarness.with({ text: '適用' }));
    await applyButton.click();

    expect(dataGrid.applyColumnState).toHaveBeenCalledWith([
      { colId: 'name', hide: false, pinned: null },
      { colId: 'customer', hide: true, pinned: null },
    ]);
  });

  it('ヘッダー名を持たない列は設定対象から除外され反映されない', async () => {
    const { service, rootLoader } = setup();
    const dataGrid = dataGridStub(
      [columnState('select'), columnState('name')],
      [columnDef('select'), columnDef('name', '工事名')],
    );

    service.open(dataGrid);

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    const applyButton = await dialog.getHarness(ButtonHarness.with({ text: '適用' }));
    await applyButton.click();

    expect(dataGrid.applyColumnState).toHaveBeenCalledWith([
      { colId: 'name', hide: false, pinned: null },
    ]);
  });

  it('初期設定に戻すと列の状態が初期化される', async () => {
    const { service, rootLoader } = setup();
    const dataGrid = dataGridStub();

    service.open(dataGrid);

    const settingsDialog = await rootLoader.getHarness(MatDialogHarness);
    const resetButton = await settingsDialog.getHarness(
      ButtonHarness.with({ text: '初期設定に戻す' }),
    );
    await resetButton.click();

    const dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
    const confirmDialog = dialogs[dialogs.length - 1];
    const confirmButton = await confirmDialog.getHarness(
      ButtonHarness.with({ text: '初期設定に戻す' }),
    );
    await confirmButton.click();

    expect(dataGrid.resetColumnState).toHaveBeenCalled();
    expect(dataGrid.applyColumnState).not.toHaveBeenCalled();
  });

  it('設定せずに閉じると列の状態は変更されない', async () => {
    const { service, rootLoader } = setup();
    const dataGrid = dataGridStub();

    service.open(dataGrid);

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    const cancelButton = await dialog.getHarness(ButtonHarness.with({ text: 'キャンセル' }));
    await cancelButton.click();

    expect(dataGrid.applyColumnState).not.toHaveBeenCalled();
    expect(dataGrid.resetColumnState).not.toHaveBeenCalled();
  });
});
