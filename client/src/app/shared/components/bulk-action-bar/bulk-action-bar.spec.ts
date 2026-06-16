import { TestBed } from '@angular/core/testing';
import { BulkActionBar } from './bulk-action-bar';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { IconButtonHarness } from '../../testing/icon-button-harness';
import { BulkAction } from './bulk-action-bar.type';

describe('BulkActionBar', () => {
  function setup({ selectedCount = 0, actions = [] as BulkAction[] } = {}) {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    });

    const fixture = TestBed.createComponent(BulkActionBar);
    fixture.componentRef.setInput('selectedCount', selectedCount);
    fixture.componentRef.setInput('actions', actions);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);

    return { fixture, loader };
  }

  describe('一括操作バーの表示', () => {
    it('選択中の件数がないとき一括操作バーは表示されない', () => {
      const { fixture } = setup({ selectedCount: 0 });

      // 表示制御がCSSによって行われるため、例外的にDOMの存在ではなくクラスの有無で検証する
      expect(fixture.nativeElement.classList.contains('is-visible')).toBe(false);
    });

    it('選択中の件数があるとき一括操作バーが表示される', () => {
      const { fixture } = setup({ selectedCount: 1 });

      expect(fixture.nativeElement.classList.contains('is-visible')).toBe(true);
    });

    it('選択中の件数が表示される', () => {
      const { fixture } = setup({ selectedCount: 3 });

      expect(fixture.nativeElement.textContent).toContain('3 件を選択中');
    });
  });

  describe('アクションの実行', () => {
    it('アクションのボタンを押すとそのアクションが実行される', async () => {
      const onAction = vi.fn();
      const actions: BulkAction[] = [{ icon: 'delete', tooltip: '削除', onAction }];
      const { loader } = setup({ selectedCount: 1, actions });

      const button = await loader.getHarness(IconButtonHarness.with({ ariaLabel: '削除' }));
      await button.click();

      expect(onAction).toHaveBeenCalledOnce();
    });

    it('無効化されたアクションのボタンは押せない状態で表示される', async () => {
      const actions: BulkAction[] = [
        {
          icon: 'delete',
          tooltip: '削除',
          disabled: true,
          disabledTooltip: '承認済みのため削除できません',
          onAction: vi.fn(),
        },
      ];
      const { loader } = setup({ selectedCount: 1, actions });

      const button = await loader.getHarness(IconButtonHarness.with({ ariaLabel: '削除' }));

      expect(await button.isDisabled()).toBe(true);
    });
  });

  describe('選択の解除', () => {
    it('「選択をクリア」を押すと選択が解除される', async () => {
      const onClear = vi.fn();
      const { fixture, loader } = setup({ selectedCount: 1 });
      fixture.componentInstance.clear.subscribe(onClear);

      const clearButton = await loader.getHarness(
        IconButtonHarness.with({ ariaLabel: '選択をクリア' }),
      );
      await clearButton.click();

      expect(onClear).toHaveBeenCalledOnce();
    });
  });
});
