import { Component, computed, input, output } from '@angular/core';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-grid-paginator',
  imports: [Icon],
  templateUrl: './grid-paginator.html',
  styleUrl: './grid-paginator.scss',
})
export class GridPaginator {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalRows = input.required<number>();
  readonly pageSizeOptions = input.required<number[]>();

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly displayPage = computed(() => {
    if (this.totalPages() === 0) return 0;
    return this.currentPage() + 1;
  });
  protected readonly startRow = computed(() => {
    if (this.totalPages() === 0) return 0;
    return this.currentPage() * this.pageSize() + 1;
  });
  protected readonly endRow = computed(() =>
    Math.min((this.currentPage() + 1) * this.pageSize(), this.totalRows()),
  );
  protected readonly isFirstPage = computed(() => this.currentPage() === 0);
  protected readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);

  protected onPageSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(Number(value));
  }

  protected goToFirst(): void {
    this.pageChange.emit(0);
  }

  protected goToPrevious(): void {
    if (!this.isFirstPage()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  protected goToNext(): void {
    if (!this.isLastPage()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  protected goToLast(): void {
    this.pageChange.emit(this.totalPages() - 1);
  }
}
