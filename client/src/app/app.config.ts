import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ja } from 'date-fns/locale';
import { JaDateFnsAdapter } from './core/utils/ja-date-fns-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: ja },
    { provide: DateAdapter, useClass: JaDateFnsAdapter },
  ],
};
