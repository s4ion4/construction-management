import { Component, computed, input, signal } from '@angular/core';
import { Icon } from '../icon/icon';

export type ToastVariant = 'success' | 'error';

const TOAST_ICONS: Record<ToastVariant, string> = {
  success: 'check_circle',
  error: 'error',
};

@Component({
  selector: 'app-toast',
  imports: [Icon],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  host: {
    '[attr.role]': 'variant() === "error" ? "alert" : "status"',
    '[attr.data-variant]': 'variant()',
    '[class.leaving]': 'leaving()',
  },
})
export class Toast {
  readonly variant = input.required<ToastVariant>();
  readonly message = input.required<string>();
  readonly leaving = signal(false);

  protected readonly iconName = computed(() => TOAST_ICONS[this.variant()]);
}
