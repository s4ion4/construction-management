export interface CheckboxFilterOption<TValue> {
  readonly value: TValue;
  readonly label: string;
}

export type CheckboxFilterModel<TValue> = readonly TValue[];

export interface CheckboxFilterParams<TValue> {
  readonly values: readonly CheckboxFilterOption<TValue>[];
}
