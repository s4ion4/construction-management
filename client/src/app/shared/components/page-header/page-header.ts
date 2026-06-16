import { Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'header[app-page-header]',
  imports: [Icon],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  host: {
    class: 'app-page-header',
  },
})
export class PageHeader {
  readonly title = input<string>();
  readonly menuToggle = output<void>();
}
