import { iconSetQuartzLight, themeQuartz } from 'ag-grid-community';

export const dataGridTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
    fontFamily: 'inherit',
    fontSize: 12,
    spacing: 6,
    wrapperBorderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
  })
  .withParams(
    {
      accentColor: 'var(--color-teal-500)',
      borderColor: 'var(--color-gray-200)',
      foregroundColor: 'var(--color-gray-900)',
      headerTextColor: 'var(--color-gray-600)',
      oddRowBackgroundColor: 'var(--color-gray-50)',
      rowHoverColor: 'var(--color-teal-50)',
    },
    'light',
  )
  .withParams(
    {
      accentColor: 'var(--color-teal-400)',
      borderColor: 'var(--color-gray-700)',
      foregroundColor: 'var(--color-gray-100)',
      headerTextColor: 'var(--color-gray-400)',
      oddRowBackgroundColor: 'var(--color-gray-800)',
      rowHoverColor: 'var(--color-teal-900)',
    },
    'dark',
  );
