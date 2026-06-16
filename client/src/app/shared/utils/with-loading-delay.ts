import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, timer } from 'rxjs';

const DEFAULT_SHOW_DELAY_MS = 200;
const DEFAULT_MIN_DISPLAY_MS = 400;

export function withLoadingDelay(
  isLoading: Signal<boolean>,
  showDelay = DEFAULT_SHOW_DELAY_MS,
  minDisplayTime = DEFAULT_MIN_DISPLAY_MS,
): Signal<boolean> {
  return toSignal(
    toObservable(isLoading).pipe(
      switchMap((loading) =>
        loading
          ? timer(showDelay).pipe(map(() => true))
          : timer(minDisplayTime).pipe(map(() => false)),
      ),
    ),
    { initialValue: false },
  );
}
