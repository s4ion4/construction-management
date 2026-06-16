import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';

import { MessageDialog, MessageDialogData } from './message-dialog';
import { ButtonHarness } from '../../../testing/button-harness';

@Component({
  template: '',
  imports: [MatDialogModule],
})
class TestHostComponent {}

const defaultData: MessageDialogData = {
  title: 'データの送信',
  message: 'データを送信します。よろしいですか？',
};

describe('MessageDialog', () => {
  async function setup(data: MessageDialogData) {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const dialogRef = TestBed.inject(MatDialog).open<MessageDialog, MessageDialogData, void>(
      MessageDialog,
      { data },
    );

    await fixture.whenStable();

    return { rootLoader, dialogRef };
  }

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
  });

  it('指定したタイトルが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, title: '保存完了' });

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    expect(await dialog.getTitleText()).toBe('保存完了');
  });

  it('指定したメッセージが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, message: '変更が反映されました' });

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    expect(await dialog.getContentText()).toBe('変更が反映されました');
  });

  it('閉じるボタンに指定したラベルが表示される', async () => {
    const { rootLoader } = await setup({ ...defaultData, closeButtonLabel: 'OK' });

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: 'OK' }));
    expect(await closeButton.getText()).toBe('OK');
  });

  it('閉じるボタンのラベルを省略すると「閉じる」と表示される', async () => {
    const { rootLoader } = await setup(defaultData);

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: '閉じる' }));
    expect(await closeButton.getText()).toBe('閉じる');
  });

  it('閉じるボタンをクリックするとダイアログが閉じる', async () => {
    const { rootLoader, dialogRef } = await setup(defaultData);

    let closed = false;
    dialogRef.afterClosed().subscribe(() => (closed = true));

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: '閉じる' }));
    await closeButton.click();

    expect(closed).toBe(true);
  });
});
