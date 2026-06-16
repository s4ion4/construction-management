import { Component, inject, signal, viewChild } from '@angular/core';
import { DataGrid } from '../../../shared/components/data-grid/data-grid/data-grid';
import { DepartmentApiService } from '../data-access/department-api.service';
import { DepartmentResponse } from '../models/department.response';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconButton } from '../../../shared/components/button/icon-button/icon-button';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { createDepartmentColumnDefs } from './department-columns';
import { ColumnSettingsService } from '../../../shared/services/column-settings.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-department-list',
  imports: [DataGrid, IconButton, MatTooltipModule, EmptyState, SearchInput, PageHeader],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss',
})
export class DepartmentList {
  private readonly departmentApiService = inject(DepartmentApiService);
  private readonly columnSettingsService = inject(ColumnSettingsService);
  protected readonly layoutService = inject(LayoutService);

  private readonly dataGrid = viewChild.required<DataGrid<DepartmentResponse>>(DataGrid);

  protected readonly departmentsResource = this.departmentApiService.createDepartmentsResource();
  protected readonly searchQuery = signal('');
  protected readonly columnDefs = createDepartmentColumnDefs();

  protected exportCsv(): void {
    this.dataGrid().exportCsv();
  }

  protected openColumnSettings(): void {
    this.columnSettingsService.open(this.dataGrid());
  }
}
