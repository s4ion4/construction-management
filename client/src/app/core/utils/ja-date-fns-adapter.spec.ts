import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ja } from 'date-fns/locale';

import { JaDateFnsAdapter } from './ja-date-fns-adapter';

describe('JaDateFnsAdapter', () => {
  let adapter: JaDateFnsAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: ja },
        JaDateFnsAdapter,
      ],
    });
    adapter = TestBed.inject(JaDateFnsAdapter);
  });

  it('日付名が1〜31の数字文字列で返る', () => {
    const dateNames = adapter.getDateNames();

    expect(dateNames).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
    ]);
  });
});
