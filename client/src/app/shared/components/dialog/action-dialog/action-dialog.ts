import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Button, ButtonVariant } from '../../button/button/button';

export interface ActionDialogData {
  title: string;
  message: string;
  actionButtonLabel: string;
  closeButtonLabel?: string;
  variant?: 'default' | 'danger';
}

@Component({
  selector: 'app-action-dialog',
  imports: [MatDialogModule, Button],
  templateUrl: './action-dialog.html',
  styleUrl: './action-dialog.scss',
})
export class ActionDialog {
  protected readonly data = inject<ActionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ActionDialog>);

  protected get actionVariant(): ButtonVariant {
    return this.data.variant === 'danger' ? 'danger' : 'primary';
  }

  protected get closeButtonLabel(): string {
    return this.data.closeButtonLabel ?? 'キャンセル';
  }

  protected onAction(): void {
    this.dialogRef.close(true);
  }

  protected onClose(): void {
    this.dialogRef.close(false);
  }
}
