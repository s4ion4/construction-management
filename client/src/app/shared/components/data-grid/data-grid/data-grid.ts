import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  ColumnState,
  convertColumnState,
  DragStoppedEvent,
  FilterChangedEvent,
  FilterModel,
  GridApi,
  GridReadyEvent,
  GridState,
  RowSelectionOptions,
  SelectionChangedEvent,
  SelectionColumnDef,
  SortChangedEvent,
} from 'ag-grid-community';
import { Button } from '../../button/button/button';
import { GridPaginator } from '../grid-paginator/grid-paginator';
import { AG_GRID_LOCALE_JP } from '@ag-grid-community/locale';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { SessionStorageService } from '../../../../core/services/session-storage.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { dataGridTheme } from './data-grid-theme';

@Component({
  selector: 'app-data-grid',
  imports: [AgGridAngular, GridPaginator, Button],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
})
export class DataGrid<T> {
  private readonly sessionStorage = inject(SessionStorageService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly themeService = inject(ThemeService);

  readonly rows = input.required<T[]>();
  readonly columnDefs = input.required<ColDef<T>[]>();
  readonly storageKey = input.required<string>();
  readonly loading = input(false);
  readonly quickFilterText = input('');
  readonly rowSelection = input<RowSelectionOptions<T>>();

  readonly selectionChanged = output<T[]>();

  protected readonly selectionColumnDef: SelectionColumnDef = {
    pinned: 'left',
    lockPosition: 'left',
    width: 40,
  };

  protected readonly localeText = { ...AG_GRID_LOCALE_JP };
  protected readonly paginationPageSize = signal(20);
  protected readonly pageSizeOptions = [20, 50, 100];
  protected readonly theme = dataGridTheme;

  protected readonly filterStorageKey = computed(() => `${this.storageKey()}:filter-model`);
  protected readonly columnStateStorageKey = computed(() => `${this.storageKey()}:column-state`);

  protected readonly initialState = computed<GridState>(() => {
    const columnState = this.localStorage.get<ColumnState[]>(this.columnStateStorageKey());
    if (!columnState) return {};
    return { ...convertColumnState(columnState), partialColumnState: true };
  });
  protected readonly suppressColumnMoveAnimation = signal(true);
  protected readonly isFiltered = signal(false);

  protected readonly currentPage = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalRows = signal(0);

  private gridApi!: GridApi;

  constructor() {
    effect(() => {
      document.body.dataset['agThemeMode'] = this.themeService.isDarkMode() ? 'dark' : 'light';
    });
  }

  exportCsv(): void {
    const columnKeys = this.gridApi
      .getAllDisplayedColumns()
      .filter((col) => col.getColDef().headerName !== undefined)
      .map((col) => col.getColId());

    this.gridApi.exportDataAsCsv({ columnKeys });
  }

  getColumnState(): ColumnState[] {
    return this.gridApi.getColumnState();
  }

  getColumnDefs(): ColDef[] {
    return (this.gridApi.getColumnDefs() ?? []) as ColDef[];
  }

  applyColumnState(state: ColumnState[]): void {
    this.gridApi.applyColumnState({ state, applyOrder: true });
    this.saveColumnState(this.gridApi);
  }

  resetColumnState(): void {
    this.gridApi.resetColumnState();
    this.localStorage.remove(this.columnStateStorageKey());
  }

  clearSelection(): void {
    this.gridApi.deselectAll();
  }

  protected onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.restoreFilterModel();
  }

  protected onFirstDataRendered(): void {
    this.suppressColumnMoveAnimation.set(false);
  }

  protected onDragStopped(event: DragStoppedEvent): void {
    this.saveColumnState(event.api);
  }

  protected onSortChanged(event: SortChangedEvent): void {
    this.saveColumnState(event.api);
  }

  protected onSelectionChanged(event: SelectionChangedEvent<T>): void {
    this.selectionChanged.emit(event.api.getSelectedRows());
  }

  protected onFilterChanged(event: FilterChangedEvent): void {
    const isAnyFilterPresent = event.api.isAnyFilterPresent();
    this.isFiltered.set(isAnyFilterPresent);

    if (isAnyFilterPresent) {
      this.sessionStorage.set<FilterModel>(this.filterStorageKey(), event.api.getFilterModel());
    } else {
      this.sessionStorage.remove(this.filterStorageKey());
    }
  }

  protected onResetFilters(): void {
    this.gridApi.setFilterModel(null);
  }

  protected onPaginationChanged(): void {
    if (!this.gridApi) return;

    this.currentPage.set(this.gridApi.paginationGetCurrentPage());
    this.totalPages.set(this.gridApi.paginationGetTotalPages());
    this.totalRows.set(this.gridApi.paginationGetRowCount());
  }

  protected onPageChange(page: number): void {
    this.gridApi.paginationGoToPage(page);
  }

  protected onPageSizeChange(size: number): void {
    this.paginationPageSize.set(size);
  }

  private saveColumnState(api: GridApi) {
    this.localStorage.set<ColumnState[]>(this.columnStateStorageKey(), api.getColumnState());
  }

  private restoreFilterModel() {
    const savedModel = this.sessionStorage.get<FilterModel>(this.filterStorageKey());
    if (savedModel) {
      this.gridApi.setFilterModel(savedModel);
    }
  }
}
