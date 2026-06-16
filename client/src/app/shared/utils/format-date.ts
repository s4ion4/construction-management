import { format } from 'date-fns';

export function formatDate(value: Date | null): string {
  return value ? format(value, 'yyyy/MM/dd') : '';
}

export function formatDateTime(value: Date | null): string {
  return value ? format(value, 'yyyy/MM/dd HH:mm') : '';
}

export function formatDateOnly(date: Date | null): string {
  return date ? format(date, 'yyyy-MM-dd') : '';
}
