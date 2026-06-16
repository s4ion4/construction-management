import { ColDef } from 'ag-grid-community';
import { ProjectResponse } from '../models/project.response';
import {
  formatOrderType,
  formatEstimateNumber,
  formatProjectStatus,
} from '../utils/project-formatters';
import { formatDate, formatDateTime } from '../../../shared/utils/format-date';
import { CheckboxFilter } from '../../../shared/components/data-grid/checkbox-filter/checkbox-filter';
import { checkboxFilterPredicate } from '../../../shared/components/data-grid/checkbox-filter/checkbox-filter-predicate';
import { OrderType, orderTypeLabels } from '../models/order-type.enum';
import { ProjectStatus, projectStatusLabels } from '../models/project-status.enum';
import {
  RowActionCell,
  RowActionCellParams,
} from '../../../shared/components/data-grid/row-action-cell/row-action-cell';
import {
  StatusDotCell,
  StatusDotCellParams,
} from '../../../shared/components/data-grid/status-dot-cell/status-dot-cell';

export function createProjectColumnDefs(
  onDetail: (row: ProjectResponse) => void,
): ColDef<ProjectResponse>[] {
  return [
    {
      colId: 'actions',
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      lockPosition: 'left',
      pinned: 'left',
      cellRenderer: RowActionCell<ProjectResponse>,
      cellRendererParams: {
        onAction: onDetail,
        icon: 'contract_edit',
        ariaLabel: '詳細',
      } satisfies RowActionCellParams<ProjectResponse>,
    },
    {
      field: 'projectCode',
      headerName: '工事コード',
      initialWidth: 160,
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'name',
      headerName: '工事名',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      tooltipField: 'name',
    },
    {
      colId: 'customerCode',
      headerName: '得意先コード',
      initialWidth: 180,
      minWidth: 180,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.customer.code,
    },
    {
      colId: 'customerName',
      headerName: '得意先名',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.customer.name,
    },
    {
      field: 'orderDate',
      headerName: '受注日',
      initialWidth: 140,
      minWidth: 140,
      filter: 'agDateColumnFilter',
      valueGetter: (params) => (params.data?.orderDate ? new Date(params.data.orderDate) : null),
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'orderType',
      headerName: '受注区分',
      initialWidth: 150,
      minWidth: 150,
      filter: {
        component: CheckboxFilter<OrderType>,
        doesFilterPass: checkboxFilterPredicate,
      },
      filterParams: { values: orderTypeLabels },
      valueFormatter: (params) => formatOrderType(params.value),
    },
    {
      colId: 'estimateNumber',
      headerName: '見積番号',
      initialWidth: 150,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => formatEstimateNumber(params.data?.estimateNumber ?? null),
    },
    {
      colId: 'departmentCode',
      headerName: '担当部門コード',
      initialWidth: 190,
      minWidth: 190,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.department?.code ?? null,
    },
    {
      colId: 'departmentName',
      headerName: '担当部門',
      initialWidth: 150,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.department?.name ?? null,
    },
    {
      colId: 'salesStaffCode',
      headerName: '営業担当者コード',
      initialWidth: 200,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.salesStaff?.code ?? null,
    },
    {
      colId: 'salesStaffName',
      headerName: '営業担当者',
      initialWidth: 160,
      minWidth: 160,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.salesStaff?.name ?? null,
    },
    {
      colId: 'constructionStaffCode',
      headerName: '工事担当者コード',
      initialWidth: 200,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.constructionStaff?.code ?? null,
    },
    {
      colId: 'constructionStaffName',
      headerName: '工事担当者',
      initialWidth: 160,
      minWidth: 160,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => params.data?.constructionStaff?.name ?? null,
    },
    {
      field: 'status',
      headerName: '承認',
      initialWidth: 130,
      minWidth: 130,
      filter: {
        component: CheckboxFilter<ProjectStatus>,
        doesFilterPass: checkboxFilterPredicate,
      },
      filterParams: { values: projectStatusLabels },
      valueFormatter: (params) => formatProjectStatus(params.value),
      cellRenderer: StatusDotCell<ProjectStatus>,
      cellRendererParams: {
        toStatusDot: (value: ProjectStatus) => ({
          label: formatProjectStatus(value),
          status: value === ProjectStatus.Approved ? 'success' : 'default',
        }),
      } satisfies StatusDotCellParams<ProjectStatus>,
    },
    {
      field: 'approvedAt',
      headerName: '承認日時',
      initialWidth: 150,
      minWidth: 150,
      filter: 'agDateColumnFilter',
      valueGetter: (params) => (params.data?.approvedAt ? new Date(params.data.approvedAt) : null),
      valueFormatter: (params) => formatDateTime(params.value),
    },
  ];
}
