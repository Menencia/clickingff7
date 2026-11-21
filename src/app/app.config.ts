import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateMultiHttpLoader } from '@ngx-translate/http-loader';
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
        .toPromise()
        .then(() => game.run());
    }),
  ],
};
