import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const DARK_THEME = 'dark';
const LIGHT_THEME = 'cupcake';

@Component({
  selector: 'app-theme-picker',
  imports: [FormsModule],
  templateUrl: './theme-picker.component.html',
})
export class ThemePickerComponent {
  readonly DEFAULT_THEME = DARK_THEME;

  isLightTheme = signal(false);

  constructor() {
    effect(() => {
      this.setTheme(this.isLightTheme() ? LIGHT_THEME : DARK_THEME);
    });
  }

  ngOnInit() {
    let savedTheme = localStorage.getItem('theme');
    // Older versions stored the light theme as 'light', which is no longer a configured daisyUI theme.
    if (savedTheme === 'light') {
      savedTheme = LIGHT_THEME;
    }
    if (savedTheme) {
      this.setTheme(savedTheme);
      this.isLightTheme.set(savedTheme !== DARK_THEME);
    } else {
      this.setTheme(this.DEFAULT_THEME);
    }
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
