import { Component, input } from '@angular/core';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-icon',
  imports: [],
  template: `
    <span
      class="material-symbols-outlined icon"
      [attr.data-size]="size()"
      [attr.data-filled]="filled() ? '' : null"
      aria-hidden="true"
      >{{ name() }}</span
    >
  `,
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input<IconSize>('md');
  readonly filled = input<boolean>(false);
}
