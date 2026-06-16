export interface BulkAction {
  icon: string;
  tooltip: string;
  disabled?: boolean;
  disabledTooltip?: string;
  onAction: () => void;
}
