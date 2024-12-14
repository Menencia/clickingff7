import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  constructor(private translateService: TranslateService) {
    this.translateService.defaultLang = 'en';
  }

  getLanguage(lang: string | undefined): string {
    return ['en', 'fr', 'es'].find((l) => l === lang) ?? 'en';
  }

  setDefaultLang() {
    return this.getLanguage(this.translateService.getBrowserLang());
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }
}
