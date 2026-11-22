import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const DARK_THEME = 'dark';
const LIGHT_THEME = 'cupcake';
// Older versions stored the light theme as 'light', which is no longer a configured daisyUI theme.
const LEGACY_LIGHT_THEME = 'light';

function isSavedThemeLight(): boolean {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === LIGHT_THEME || savedTheme === LEGACY_LIGHT_THEME;
}

@Component({
  selector: 'app-theme-picker',
  imports: [FormsModule],
  templateUrl: './theme-picker.component.html',
})
export class ThemePickerComponent {
  readonly isLightTheme = signal(isSavedThemeLight());

  constructor() {
    effect(() => {
      this.setTheme(this.isLightTheme() ? LIGHT_THEME : DARK_THEME);
    });
  }

  private setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
