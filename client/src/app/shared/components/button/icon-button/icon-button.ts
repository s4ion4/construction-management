import { Component, input } from '@angular/core';

export type IconButtonVariant = 'default' | 'ghost';

@Component({
  selector: 'button[app-icon-button]',
  imports: [],
  template: `
    <span class="icon-button-icon material-symbols-outlined" aria-hidden="true">
      {{ icon() }}
    </span>
  `,
  styleUrl: './icon-button.scss',
  host: {
    '[attr.data-variant]': 'variant()',
    class: 'app-icon-button',
  },
})
export class IconButton {
  readonly icon = input.required<string>();
  readonly variant = input<IconButtonVariant>('default');
}
