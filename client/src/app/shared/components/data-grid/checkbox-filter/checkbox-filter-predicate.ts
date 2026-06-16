import type { DoesFilterPassParams } from 'ag-grid-community';
import { CheckboxFilterModel } from './checkbox-filter.type';

export function checkboxFilterPredicate<TValue, TData = unknown>(
  params: DoesFilterPassParams<TData, CheckboxFilterModel<TValue>>,
): boolean {
  return params.model.includes(params.handlerParams.getValue(params.node));
}
