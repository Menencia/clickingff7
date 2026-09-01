import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateMultiHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { DataService } from './core/services/data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateMultiHttpLoader({
        resources: [
          { prefix: './assets/i18n/', suffix: '/main.json' },
          { prefix: './assets/i18n/', suffix: '/help.json' },
        ],
      }),
      fallbackLang: 'en',
      lang: 'de',
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideAppInitializer(() => {
      const initializerFn = (
        (data: DataService) => () =>
          data.preloadAll().toPromise()
      )(inject(DataService));
      return initializerFn();
    }),
  ],
};
