import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateMultiHttpLoader } from '@ngx-translate/http-loader';
import { tap } from 'rxjs';
import { routes } from './app.routes';
import { DataService } from './core/services/data.service';
import { GameService } from './core/services/game.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
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
      lang: 'fr',
    }),
    provideAppInitializer(() => {
      const game = inject(GameService);
      return inject(DataService)
        .preloadAll()
        .pipe(tap(() => game.run()));
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
