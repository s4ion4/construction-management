import { ColDef } from 'ag-grid-community';
import { CustomerResponse } from '../models/customer.response';

export function createCustomerColumnDefs(): ColDef<CustomerResponse>[] {
  return [
    {
      field: 'customerCode',
      headerName: '得意先コード',
      initialWidth: 180,
      minWidth: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'name',
      headerName: '得意先名',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      tooltipField: 'name',
    },
  ];
}
