import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, vi } from 'vitest';
import { withLoadingDelay } from './with-loading-delay';

describe('withLoadingDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function setup() {
    const isLoading = signal(false);
    const showing = TestBed.runInInjectionContext(() => withLoadingDelay(isLoading));

    const advance = (ms: number) => {
      vi.advanceTimersByTime(ms);
      TestBed.tick();
    };

    const setLoading = (loading: boolean) => {
      isLoading.set(loading);
      TestBed.tick();
    };

    return { showing, setLoading, advance };
  }

  it('読み込み開始から表示遅延が経過すると表示中になる', () => {
    const { showing, setLoading, advance } = setup();

    setLoading(true);

    advance(199);
    expect(showing()).toBe(false);

    advance(1);
    expect(showing()).toBe(true);
  });

  it('読み込み完了から最低表示時間が経過すると非表示になる', () => {
    const { showing, setLoading, advance } = setup();

    setLoading(true);
    advance(200);
    expect(showing()).toBe(true);

    setLoading(false);

    advance(399);
    expect(showing()).toBe(true);

    advance(1);
    expect(showing()).toBe(false);
  });

  it('表示遅延が経過する前に読み込みが終わると表示中にならない', () => {
    const { showing, setLoading, advance } = setup();

    setLoading(true);
    advance(199);

    setLoading(false);
    advance(200);

    expect(showing()).toBe(false);
  });
});
