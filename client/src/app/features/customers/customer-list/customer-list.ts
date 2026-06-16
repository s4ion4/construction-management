import { Component, inject, signal, viewChild } from '@angular/core';
import { DataGrid } from '../../../shared/components/data-grid/data-grid/data-grid';
import { CustomerApiService } from '../data-access/customer-api.service';
import { CustomerResponse } from '../models/customer.response';
import { createCustomerColumnDefs } from './customer-columns';
import { IconButton } from '../../../shared/components/button/icon-button/icon-button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ColumnSettingsService } from '../../../shared/services/column-settings.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-customer-list',
  imports: [DataGrid, IconButton, MatTooltipModule, EmptyState, SearchInput, PageHeader],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList {
  private readonly customerApiService = inject(CustomerApiService);
  private readonly columnSettingsService = inject(ColumnSettingsService);
  protected readonly layoutService = inject(LayoutService);

  private readonly dataGrid = viewChild.required<DataGrid<CustomerResponse>>(DataGrid);

  protected readonly customersResource = this.customerApiService.createCustomersResource();
  protected readonly searchQuery = signal('');
  protected readonly columnDefs = createCustomerColumnDefs();

  protected exportCsv(): void {
    this.dataGrid().exportCsv();
  }

  protected openColumnSettings(): void {
    this.columnSettingsService.open(this.dataGrid());
  }
}
