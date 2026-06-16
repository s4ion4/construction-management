import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { ColumnSettingsDialog } from './column-settings-dialog';
import { Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { ButtonHarness } from '../../../testing/button-harness';
import { ColumnSetting, ColumnSettingsDialogResult } from './column-settings.type';

@Component({
  template: '',
  imports: [MatDialogModule],
})
class TestHostComponent {}

describe('ColumnSettingsDialog', () => {
  async function setup(data: readonly ColumnSetting[]) {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const dialogRef = TestBed.inject(MatDialog).open<
      ColumnSettingsDialog,
      readonly ColumnSetting[],
      ColumnSettingsDialogResult
    >(ColumnSettingsDialog, { data });

    await fixture.whenStable();

    return { rootLoader, dialogRef };
  }

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
  });

  describe('初期表示', () => {
    it('表示中の列が表示中リストに表示される', async () => {
      await setup([
        { key: 'name', label: '工事名', visible: true, pinned: null },
        { key: 'code', label: '工事コード', visible: true, pinned: null },
      ]);

      const visibleSection = document.querySelector('[aria-labelledby="visible-heading"]')!;
      expect(visibleSection.textContent).toContain('工事名');
      expect(visibleSection.textContent).toContain('工事コード');
    });

    it('非表示の列が非表示リストに表示される', async () => {
      await setup([
        { key: 'name', label: '工事名', visible: true, pinned: null },
        { key: 'status', label: 'ステータス', visible: false, pinned: null },
      ]);

      const hiddenSection = document.querySelector('[aria-labelledby="hidden-heading"]')!;
      expect(hiddenSection.textContent).toContain('ステータス');
    });

    it('ピン留め列が表示中リストに表示される', async () => {
      await setup([
        { key: 'code', label: '工事コード', visible: true, pinned: 'left' },
        { key: 'name', label: '工事名', visible: true, pinned: null },
      ]);

      const visibleSection = document.querySelector('[aria-labelledby="visible-heading"]')!;
      expect(visibleSection.textContent).toContain('工事コード');
    });

    it('表示中の列が0件のとき「項目がありません」が表示される', async () => {
      await setup([{ key: 'name', label: '工事名', visible: false, pinned: null }]);

      const visibleSection = document.querySelector('[aria-labelledby="visible-heading"]')!;
      expect(visibleSection.textContent).toContain('項目がありません');
    });

    it('非表示の列が0件のとき非表示リストへの移動を促す案内が表示される', async () => {
      await setup([{ key: 'name', label: '工事名', visible: true, pinned: null }]);

      const hiddenSection = document.querySelector('[aria-labelledby="hidden-heading"]')!;
      expect(hiddenSection.textContent).toContain('非表示にできます');
    });
  });

  describe('適用', () => {
    it('列の表示設定を確定すると決定が呼び出し元に送信される', async () => {
      const { rootLoader, dialogRef } = await setup([
        { key: 'name', label: '工事名', visible: true, pinned: null },
      ]);

      let result: ColumnSettingsDialogResult | undefined;
      dialogRef.afterClosed().subscribe((r) => (result = r));

      const applyButton = await rootLoader.getHarness(ButtonHarness.with({ text: '適用' }));
      await applyButton.click();

      expect(result?.action).toBe('apply');
    });
  });

  describe('初期設定に戻す', () => {
    it('確認ダイアログで「初期設定に戻す」を実行すると決定が呼び出し元に送信される', async () => {
      const { rootLoader, dialogRef } = await setup([
        { key: 'name', label: '工事名', visible: true, pinned: null },
      ]);

      let result: ColumnSettingsDialogResult | undefined;
      dialogRef.afterClosed().subscribe((r) => (result = r));

      const resetButton = await rootLoader.getHarness(
        ButtonHarness.with({ text: '初期設定に戻す' }),
      );
      await resetButton.click();

      const confirmDialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
      const confirmDialog = confirmDialogs[confirmDialogs.length - 1];
      const confirmButton = await confirmDialog.getHarness(
        ButtonHarness.with({ text: '初期設定に戻す' }),
      );
      await confirmButton.click();

      expect(result?.action).toBe('reset');
    });
  });
});
