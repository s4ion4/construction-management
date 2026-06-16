import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../button/button/button';

export interface MessageDialogData {
  title: string;
  message: string;
  closeButtonLabel?: string;
}

@Component({
  selector: 'app-message-dialog',
  imports: [MatDialogModule, Button],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {
  protected readonly data = inject<MessageDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MessageDialog>);

  protected get closeButtonLabel(): string {
    return this.data.closeButtonLabel ?? '閉じる';
  }

  protected onClose(): void {
    this.dialogRef.close();
  }
}
