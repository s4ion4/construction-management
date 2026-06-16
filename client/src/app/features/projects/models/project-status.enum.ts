export const ProjectStatus = Object.freeze({
  Pending: 1,
  Approved: 2,
} as const);

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const projectStatusLabels: readonly {
  readonly value: ProjectStatus;
  readonly label: string;
}[] = [
  { value: ProjectStatus.Pending, label: '未承認' },
  { value: ProjectStatus.Approved, label: '承認済' },
];
