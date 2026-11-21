import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-picker',
  imports: [FormsModule],
  templateUrl: './theme-picker.component.html',
})
export class ThemePickerComponent {
  readonly DEFAULT_THEME = 'dark';

  isDarkMode = signal(false);

  constructor() {
    effect(() => {
      if (this.isDarkMode()) {
        this.setTheme('cupcake');
      } else {
        this.setTheme('dark');
      }
    });
  }

  ngOnInit() {
    let savedTheme = localStorage.getItem('theme');
    // Older versions stored the light theme as 'light', which is no longer a configured daisyUI theme.
    if (savedTheme === 'light') {
      savedTheme = 'cupcake';
    }
    if (savedTheme) {
      this.setTheme(savedTheme);
      this.isDarkMode.set(savedTheme !== 'dark');
    } else {
      this.setTheme(this.DEFAULT_THEME);
    }
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
