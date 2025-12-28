import { DOCUMENT, Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme?: string;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  setupTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.applyTheme(theme);
    }
  }

  applyTheme(theme: string | undefined) {
    this.theme = theme;
    if (this.theme) {
      this.document.documentElement.setAttribute('data-theme', this.theme);
      localStorage.setItem('theme', this.theme);
    } else {
      this.document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  }
}
