import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { firstValueFrom } from 'rxjs';
import { DialogService } from './dialog.service';
import { ButtonHarness } from '../testing/button-harness';

@Component({ template: '' })
class HostComponent {}

describe('DialogService', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    });

    const service = TestBed.inject(DialogService);
    const fixture = TestBed.createComponent(HostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return { service, rootLoader };
  }

  it('実行ボタンを押すと実行が承認される', async () => {
    const { service, rootLoader } = setup();

    const confirmed = firstValueFrom(
      service.openActionDialog({
        title: '削除確認',
        message: '本当に削除しますか？',
        actionButtonLabel: '削除する',
      }),
    );

    const actionButton = await rootLoader.getHarness(ButtonHarness.with({ text: '削除する' }));
    await actionButton.click();

    expect(await confirmed).toBe(true);
  });

  it('実行ボタンを押さずに閉じると実行が承認されない', async () => {
    const { service, rootLoader } = setup();

    const confirmed = firstValueFrom(
      service.openActionDialog({
        title: '削除確認',
        message: '本当に削除しますか？',
        actionButtonLabel: '削除する',
      }),
    );

    const dialog = await rootLoader.getHarness(MatDialogHarness);
    await dialog.close();

    expect(await confirmed).toBe(false);
  });

  it('閉じるボタンを押すと閉じたことが呼び出し元に伝わる', async () => {
    const { service, rootLoader } = setup();

    const closed = firstValueFrom(
      service.openMessageDialog({ title: '保存完了', message: '変更が反映されました' }),
    );

    const closeButton = await rootLoader.getHarness(ButtonHarness.with({ text: '閉じる' }));
    await closeButton.click();

    expect(await closed).toBeUndefined();
  });
});
