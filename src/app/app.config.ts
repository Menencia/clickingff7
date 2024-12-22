import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

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
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    provideTranslateService({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (data: DataService) => () => data.preloadAll().toPromise(),
      deps: [DataService],
      multi: true,
    },
  ],
};
