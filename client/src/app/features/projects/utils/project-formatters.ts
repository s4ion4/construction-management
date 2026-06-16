import { OrderType, orderTypeLabels } from '../models/order-type.enum';
import { ProjectStatus, projectStatusLabels } from '../models/project-status.enum';
import { EstimateNumberResponse } from '../models/project.response';

export function formatOrderType(value: OrderType): string {
  return orderTypeLabels.find((entry) => entry.value === value)?.label ?? '';
}

export function formatProjectStatus(value: ProjectStatus): string {
  return projectStatusLabels.find((entry) => entry.value === value)?.label ?? '';
}

export function formatEstimateNumber(estimateNumber: EstimateNumberResponse | null): string {
  if (estimateNumber == null) return '';
  return `${estimateNumber.mainNumber}-${estimateNumber.branchNumber}`;
}
