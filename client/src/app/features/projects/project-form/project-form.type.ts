import { OrderType } from '../models/order-type.enum';

export interface ProjectFormValue {
  projectCode: string;
  name: string;
  orderDate: Date | null;
  orderType: OrderType | null;
  estimateNumber: EstimateNumberValue;
  customer: CustomerValue;
  customerContactName: string;
  department: DepartmentValue;
  salesStaff: StaffValue;
  constructionStaff: StaffValue;
}

export interface EstimateNumberValue {
  mainNumber: string;
  branchNumber: string;
}

export interface CustomerValue {
  id: string;
  code: string;
  name: string;
}

export interface DepartmentValue {
  id: string;
  code: string;
  name: string;
}

export interface StaffValue {
  id: string;
  code: string;
  name: string;
}
