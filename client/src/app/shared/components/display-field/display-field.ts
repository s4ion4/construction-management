import { Component, input } from '@angular/core';

@Component({
  selector: 'app-display-field',
  imports: [],
  template: `
    <dl class="display-field">
      <dt class="display-field-label">{{ label() }}</dt>
      <dd class="display-field-value">
        @if (value()) {
          {{ value() }}
        } @else {
          <span class="display-field-placeholder">-</span>
        }
      </dd>
    </dl>
  `,
  styles: `
    :host {
      display: block;
    }

    .display-field {
      box-sizing: border-box;
      position: relative;
      min-height: 3rem;
      padding-left: 16px;
      padding-right: 16px;
      padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);
      padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);
      margin: 0;
      border-bottom: 1px solid var(--color-border-default);
    }

    .display-field-label {
      position: absolute;
      top: 50%;
      left: 16px;
      max-width: calc(100% - 32px);
      font-size: var(--font-size-sm);
      line-height: normal;
      letter-spacing: var(--mat-sys-body-large-tracking);
      color: var(--color-fg-faint);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transform: translateY(-106%) scale(0.75);
      transform-origin: left top;
    }

    .display-field-value {
      font-size: var(--font-size-sm);
      line-height: var(--mat-form-field-container-text-line-height, 1.25rem);
      letter-spacing: var(--mat-sys-body-large-tracking);
      color: var(--color-fg-muted);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .display-field-placeholder {
      color: var(--color-fg-faint);
    }
  `,
})
export class DisplayField {
  readonly label = input.required<string>();
  readonly value = input<string | null | undefined>();
}
