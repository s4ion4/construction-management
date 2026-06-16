import { ColDef } from 'ag-grid-community';
import { EmployeeResponse } from '../models/employee.response';

export function createEmployeeColumnDefs(): ColDef<EmployeeResponse>[] {
  return [
    {
      field: 'employeeCode',
      headerName: '社員コード',
      initialWidth: 160,
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'name',
      headerName: '氏名',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      tooltipField: 'name',
    },
    {
      field: 'departmentCode',
      headerName: '部門コード',
      initialWidth: 160,
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'departmentName',
      headerName: '部門名',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      tooltipField: 'departmentName',
    },
  ];
}
