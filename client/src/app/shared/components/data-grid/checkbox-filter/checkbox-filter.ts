import { Component, computed, signal } from '@angular/core';
import { IFilterDisplayAngularComp } from 'ag-grid-angular';
import type { FilterDisplayParams } from 'ag-grid-community';
import {
  CheckboxFilterModel,
  CheckboxFilterOption,
  CheckboxFilterParams,
} from './checkbox-filter.type';

@Component({
  selector: 'app-checkbox-filter',
  imports: [],
  templateUrl: './checkbox-filter.html',
  styleUrl: './checkbox-filter.scss',
})
export class CheckboxFilter<TValue> implements IFilterDisplayAngularComp {
  private onModelChange!: (model: CheckboxFilterModel<TValue> | null) => void;

  protected readonly options = signal<readonly CheckboxFilterOption<TValue>[]>([]);
  protected readonly selected = signal<ReadonlySet<TValue>>(new Set());

  protected readonly isAllSelected = computed(
    () => this.selected().size === this.options().length && this.options().length > 0,
  );
  protected readonly isNoneSelected = computed(() => this.selected().size === 0);
  protected readonly isPartiallySelected = computed(
    () => !this.isAllSelected() && !this.isNoneSelected(),
  );

  agInit(
    params: FilterDisplayParams<unknown, unknown, CheckboxFilterModel<TValue>> &
      CheckboxFilterParams<TValue>,
  ): void {
    this.onModelChange = params.onModelChange;
    this.options.set(params.values);
    this.selected.set(this.modelToSet(params.model, params.values));
  }

  refresh(
    params: FilterDisplayParams<unknown, unknown, CheckboxFilterModel<TValue>> &
      CheckboxFilterParams<TValue>,
  ): boolean {
    this.options.set(params.values);
    this.selected.set(this.modelToSet(params.model, params.values));
    return true;
  }

  protected onOptionToggle(value: TValue, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = new Set(this.selected());
    if (checked) {
      next.add(value);
    } else {
      next.delete(value);
    }
    this.selected.set(next);
    this.emitModel(next);
  }

  protected onAllToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = checked
      ? new Set(this.options().map((option) => option.value))
      : new Set<TValue>();
    this.selected.set(next);
    this.emitModel(next);
  }

  protected isOptionChecked(value: TValue): boolean {
    return this.selected().has(value);
  }

  private modelToSet(
    model: CheckboxFilterModel<TValue> | null,
    values: readonly CheckboxFilterOption<TValue>[],
  ): ReadonlySet<TValue> {
    if (model === null) {
      return new Set(values.map((option) => option.value));
    }
    return new Set(model);
  }

  private emitModel(selected: ReadonlySet<TValue>) {
    if (selected.size === this.options().length) {
      this.onModelChange(null);
      return;
    }
    this.onModelChange(Array.from(selected));
  }
}
