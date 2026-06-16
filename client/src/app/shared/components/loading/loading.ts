import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  template: `
    <div class="loading-content" [inert]="loading()">
      <ng-content />
    </div>
    @if (loading()) {
      <div class="loading-cover">
        <div class="loading-dots" role="status" aria-label="読み込み中">
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
    }

    .loading-content {
      display: contents;
    }

    .loading-cover {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: light-dark(hsl(0 0% 100% / 60%), hsl(0 0% 0% / 60%));
    }

    .loading-dots {
      display: flex;
      gap: var(--spacing-8);
      align-items: center;
      justify-content: center;
    }

    .loading-dot {
      width: 8px;
      height: 8px;
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-full);
      animation: loading-bounce 1.2s infinite ease-in-out;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }

    @keyframes loading-bounce {
      0%,
      80%,
      100% {
        opacity: 0.2;
        transform: scale(0.8);
      }
      40% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  host: {
    '[attr.aria-busy]': 'loading()',
  },
})
export class Loading {
  readonly loading = input(false);
}
