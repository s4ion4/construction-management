import { Component, input, model } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-search-input',
  imports: [Icon],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  readonly value = model('');
  readonly placeholder = input('フリーワード検索');
  readonly ariaLabel = input.required<string>();
}
