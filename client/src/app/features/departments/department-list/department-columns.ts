import { ColDef } from 'ag-grid-community';
import { DepartmentResponse } from '../models/department.response';

export function createDepartmentColumnDefs(): ColDef<DepartmentResponse>[] {
  return [
    {
      field: 'departmentCode',
      headerName: '部門コード',
      initialWidth: 160,
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'name',
      headerName: '部門名',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      tooltipField: 'name',
    },
  ];
}
