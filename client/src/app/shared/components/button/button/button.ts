import {
  Component,
  ElementRef,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'button[app-button], a[app-button]',
  imports: [],
  template: `
    @if (icon()) {
      <span class="button-icon material-symbols-outlined" aria-hidden="true">{{ icon() }}</span>
    }
    <span class="button-label"><ng-content /></span>
  `,
  styleUrl: './button.scss',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-icon]': 'icon() ?? null',
    '[attr.disabled]': '!isAnchor && disabled() ? "" : null',
    '[attr.aria-disabled]': 'isAnchor && disabled() ? true : null',
    '[attr.tabindex]': 'isAnchor && disabled() ? -1 : null',
    '(click)': 'onClick($event)',
    class: 'app-button',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly icon = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isAnchor = inject(ElementRef).nativeElement.tagName.toLowerCase() === 'a';

  protected onClick(event: Event): void {
    if (this.disabled() && this.isAnchor) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
