import { Component, input } from '@angular/core';

export type StatusDotStatus = 'success' | 'error' | 'warning' | 'default';

@Component({
  selector: 'app-status-dot',
  imports: [],
  template: `
    <span class="status-dot-indicator" aria-hidden="true"></span>
    <span class="status-dot-label">{{ label() }}</span>
  `,
  styleUrl: './status-dot.scss',
  host: {
    role: 'status',
    '[attr.data-status]': 'status()',
  },
})
export class StatusDot {
  readonly label = input.required<string>();
  readonly status = input<StatusDotStatus>('default');
}
