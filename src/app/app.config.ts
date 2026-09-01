import { HttpBackend, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import Aura from '@primeuix/themes/aura';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { DataService } from './core/services/data.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    { prefix: './assets/i18n/', suffix: '/main.json' },
    { prefix: './assets/i18n/', suffix: '/help.json' },
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpBackend],
        },
      }),
    ),
    provideAppInitializer(() => {
      const initializerFn = (
        (data: DataService) => () =>
          data.preloadAll().toPromise()
      )(inject(DataService));
      return initializerFn();
    }),
  ],
};
