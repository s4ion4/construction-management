import { OrderType } from './order-type.enum';

export interface ProjectCreateRequest {
  projectCode: string;
  name: string;
  customerId: string;
  customerContactPerson: string | null;
  orderDate: string | null;
  orderType: OrderType;
  estimateNumber: EstimateNumberRequest | null;
  departmentId: string | null;
  salesStaffId: string | null;
  constructionStaffId: string | null;
}

export interface EstimateNumberRequest {
  mainNumber: string;
  branchNumber: string;
}
