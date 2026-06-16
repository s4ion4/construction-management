import { Component, signal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IconButton } from '../../button/icon-button/icon-button';

export interface RowActionCellParams<TData> {
  onAction: (data: TData) => void;
  icon: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-row-action-cell',
  imports: [IconButton],
  template: `
    <button
      app-icon-button
      variant="ghost"
      [icon]="icon()"
      [attr.aria-label]="ariaLabel()"
      (click)="onClick()"></button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  `,
})
export class RowActionCell<TData> implements ICellRendererAngularComp {
  private onAction!: (data: TData) => void;
  private data!: TData;

  protected readonly icon = signal('');
  protected readonly ariaLabel = signal('');

  agInit(params: ICellRendererParams<TData> & RowActionCellParams<TData>): void {
    this.onAction = params.onAction;
    this.data = params.data!;
    this.icon.set(params.icon);
    this.ariaLabel.set(params.ariaLabel);
  }

  refresh(params: ICellRendererParams<TData> & RowActionCellParams<TData>): boolean {
    this.data = params.data!;
    return true;
  }

  protected onClick(): void {
    this.onAction(this.data);
  }
}
