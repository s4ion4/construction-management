import { Injectable } from '@angular/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';

@Injectable()
export class JaDateFnsAdapter extends DateFnsAdapter {
  override getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }
}
