import { OrderType } from './order-type.enum';
import { ProjectStatus } from './project-status.enum';

export interface ProjectResponse {
  projectCode: string;
  name: string;
  customer: ProjectCustomerResponse;
  customerContactPerson: string | null;
  orderDate: string;
  orderType: OrderType;
  estimateNumber: EstimateNumberResponse | null;
  department: ProjectDepartmentResponse | null;
  salesStaff: ProjectStaffResponse | null;
  constructionStaff: ProjectStaffResponse | null;
  status: ProjectStatus;
  approvedAt: string | null;
}

export interface EstimateNumberResponse {
  mainNumber: string;
  branchNumber: string;
}

export interface ProjectCustomerResponse {
  id: string;
  code: string;
  name: string;
}

export interface ProjectDepartmentResponse {
  id: string;
  code: string;
  name: string;
}

export interface ProjectStaffResponse {
  id: string;
  code: string;
  name: string;
}
