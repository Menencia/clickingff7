import { NgModule } from '@angular/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpBackend } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    {prefix: './assets/i18n/', suffix: '/main.json'},
    {prefix: './assets/i18n/', suffix: '/help.json'}
  ]);
}

@NgModule({
  declarations: [],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    })
  ],
  exports: [
    TranslateModule
  ]
})
export class I18nModule { }
