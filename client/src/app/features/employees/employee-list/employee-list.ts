import { Component, inject, signal, viewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconButton } from '../../../shared/components/button/icon-button/icon-button';
import { DataGrid } from '../../../shared/components/data-grid/data-grid/data-grid';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmployeeApiService } from '../data-access/employee-api.service';
import { EmployeeResponse } from '../models/employee.response';
import { createEmployeeColumnDefs } from './employee-columns';
import { ColumnSettingsService } from '../../../shared/services/column-settings.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-employee-list',
  imports: [DataGrid, IconButton, MatTooltipModule, EmptyState, SearchInput, PageHeader],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private readonly employeeApiService = inject(EmployeeApiService);
  private readonly columnSettingsService = inject(ColumnSettingsService);
  protected readonly layoutService = inject(LayoutService);

  private readonly dataGrid = viewChild.required<DataGrid<EmployeeResponse>>(DataGrid);

  protected readonly employeesResource = this.employeeApiService.createEmployeesResource();
  protected readonly searchQuery = signal('');
  protected readonly columnDefs = createEmployeeColumnDefs();

  protected exportCsv(): void {
    this.dataGrid().exportCsv();
  }

  protected openColumnSettings(): void {
    this.columnSettingsService.open(this.dataGrid());
  }
}
