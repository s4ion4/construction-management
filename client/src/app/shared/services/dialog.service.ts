import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ActionDialogData, ActionDialog } from '../components/dialog/action-dialog/action-dialog';
import {
  MessageDialogData,
  MessageDialog,
} from '../components/dialog/message-dialog/message-dialog';

const DIALOG_WIDTH = '400px';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  openActionDialog(data: ActionDialogData): Observable<boolean> {
    return this.dialog
      .open<ActionDialog, ActionDialogData, boolean>(ActionDialog, {
        width: DIALOG_WIDTH,
        data,
      })
      .afterClosed()
      .pipe(map((result) => result ?? false));
  }

  openMessageDialog(data: MessageDialogData): Observable<void> {
    return this.dialog
      .open<MessageDialog, MessageDialogData>(MessageDialog, {
        width: DIALOG_WIDTH,
        data,
      })
      .afterClosed();
  }
}
