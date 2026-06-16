import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';

import { ActionDialog, ActionDialogData } from './action-dialog';
import { ButtonHarness } from '../../../testing/button-harness';

@Component({
  template: '',
  imports: [MatDialogModule],
})
class TestHostComponent {}

const defaultData: ActionDialogData = {
  title: 'データの送信',
  message: 'データを送信します。よろしいですか？',
  actionButtonLabel: '実行',
};

describe('ActionDialog', () => {
  async function setup(data: ActionDialogData) {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const dialogRef = TestBed.inject(MatDialog).open<ActionDialog, ActionDialogData, boolean>(
      ActionDialog,
      { data },
    );

    await fixture.whenStable();

    return { rootLoader, dialogRef };
  }

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
  });

  it('指定したタイトルが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, title: '削除確認' });

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    expect(await dialog.getTitleText()).toBe('削除確認');
  });

  it('指定したメッセージが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, message: '本当に削除しますか？' });

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    expect(await dialog.getContentText()).toBe('本当に削除しますか？');
  });

  it('実行ボタンに指定したラベルが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, actionButtonLabel: '削除する' });

    const actionButton = await rootLoader.getHarness(ButtonHarness.with({ text: '削除する' }));
    expect(await actionButton.getText()).toBe('削除する');
  });

  it('閉じるボタンに指定したラベルが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, closeButtonLabel: 'やめる' });

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: 'やめる' }));
    expect(await closeButton.getText()).toBe('やめる');
  });

  it('閉じるボタンのラベルを省略すると「キャンセル」と表示される', async () => {
    const { rootLoader } = await setup(defaultData);

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: 'キャンセル' }));
    expect(await closeButton.getText()).toBe('キャンセル');
  });

  it('危険操作の場合は実行ボタンのスタイルに反映される', async () => {
    const { rootLoader } = await setup({
      ...defaultData,
      variant: 'danger',
      actionButtonLabel: '削除する',
    });

    const actionButton = await rootLoader.getHarness(ButtonHarness.with({ text: '削除する' }));
    expect(await actionButton.getVariant()).toBe('danger');
  });

  it('実行ボタンをクリックすると実行される', async () => {
    const { rootLoader, dialogRef } = await setup(defaultData);

    let result: boolean | undefined;
    dialogRef.afterClosed().subscribe((r) => (result = r));

    const actionButton = await rootLoader.getHarness(ButtonHarness.with({ text: '実行' }));
    await actionButton.click();

    expect(result).toBe(true);
  });

  it('キャンセルボタンをクリックするとキャンセルされる', async () => {
    const { rootLoader, dialogRef } = await setup(defaultData);

    let result: boolean | undefined;
    dialogRef.afterClosed().subscribe((r) => (result = r));

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: 'キャンセル' }));
    await closeButton.click();

    expect(result).toBe(false);
  });
});
