import { OrderType } from './order-type.enum';
import { EstimateNumberRequest } from './project-create.request';

export interface ProjectUpdateRequest {
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
