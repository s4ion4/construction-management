export interface ColumnSetting {
  readonly key: string;
  readonly label: string;
  readonly visible: boolean;
  readonly pinned: 'left' | 'right' | null;
}

export type ColumnSettingsDialogResult =
  | { readonly action: 'apply'; readonly settings: readonly ColumnSetting[] }
  | { readonly action: 'reset' };
