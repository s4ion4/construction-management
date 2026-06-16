import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { afterEach, beforeEach, vi } from 'vitest';
import { ToastService } from './toast.service';
import { ToastHarness } from '../testing/toast-harness';

@Component({ template: '' })
class HostComponent {}

describe('ToastService', () => {
  function setup() {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(ToastService);
    const fixture = TestBed.createComponent(HostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return { service, rootLoader };
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('成功メッセージが表示される', async () => {
    const { service, rootLoader } = setup();

    service.showSuccess('保存しました');

    const toast = await rootLoader.getHarness(ToastHarness);
    expect(await toast.getMessage()).toBe('保存しました');
    expect(await toast.getVariant()).toBe('success');
  });

  it('エラーメッセージが表示される', async () => {
    const { service, rootLoader } = setup();

    service.showError('保存に失敗しました');

    const toast = await rootLoader.getHarness(ToastHarness);
    expect(await toast.getMessage()).toBe('保存に失敗しました');
    expect(await toast.getVariant()).toBe('error');
  });

  it('新しいメッセージを表示すると前のメッセージは消える', async () => {
    const { service, rootLoader } = setup();

    service.showSuccess('1件目');
    service.showSuccess('2件目');

    const toasts = await rootLoader.getAllHarnesses(ToastHarness);
    expect(toasts.length).toBe(1);
    expect(await toasts[0].getMessage()).toBe('2件目');
  });

  it('一定時間が経過するとメッセージは自動で消える', async () => {
    const { service, rootLoader } = setup();

    service.showSuccess('保存しました');
    expect(await rootLoader.hasHarness(ToastHarness)).toBe(true);

    vi.runAllTimers();

    expect(await rootLoader.hasHarness(ToastHarness)).toBe(false);
  });
});
