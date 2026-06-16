import { Component } from '@angular/core';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-page-not-found',
  imports: [EmptyState],
  template: `
    <div class="page-not-found">
      <app-empty-state
        icon="error"
        title="ページが見つかりません"
        description="お探しのページは見つかりませんでした。" />
    </div>
  `,
  styles: `
    .page-not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: var(--spacing-24);
    }
  `,
})
export class PageNotFound {}
