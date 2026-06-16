import { Component, signal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { StatusDot, StatusDotStatus } from '../../status-dot/status-dot';

export interface StatusDotData {
  label: string;
  status: StatusDotStatus;
}

export interface StatusDotCellParams<TValue> {
  toStatusDot: (value: TValue) => StatusDotData | null;
}

@Component({
  selector: 'app-status-dot-cell',
  imports: [StatusDot],
  template: `
    @if (statusDot(); as statusDot) {
      <app-status-dot [label]="statusDot.label" [status]="statusDot.status" />
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }
  `,
})
export class StatusDotCell<TValue> implements ICellRendererAngularComp {
  protected readonly statusDot = signal<StatusDotData | null>(null);

  agInit(params: ICellRendererParams & StatusDotCellParams<TValue>): void {
    this.statusDot.set(params.toStatusDot(params.value));
  }

  refresh(params: ICellRendererParams & StatusDotCellParams<TValue>): boolean {
    this.statusDot.set(params.toStatusDot(params.value));
    return true;
  }
}
