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
    const savedTheme = localStorage.getItem('theme');
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
