import { Component, input, output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconButton } from '../button/icon-button/icon-button';
import { BulkAction } from './bulk-action-bar.type';

@Component({
  selector: 'app-bulk-action-bar',
  imports: [IconButton, MatTooltipModule],
  templateUrl: './bulk-action-bar.html',
  styleUrl: './bulk-action-bar.scss',
  host: {
    '[class.is-visible]': 'selectedCount() > 0',
  },
})
export class BulkActionBar {
  readonly selectedCount = input.required<number>();
  readonly actions = input.required<BulkAction[]>();

  readonly clear = output<void>();
}
