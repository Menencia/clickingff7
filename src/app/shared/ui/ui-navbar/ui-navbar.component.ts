import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { helpData } from 'src/app/models/help';

// declare this to by pass typescript error
// can put this in index.d.ts file
declare var introJs: any;

enum Theme {
  Light = 'light',
  Dark = 'dark',
}

@Component({
  selector: 'app-ui-navbar',
  templateUrl: './ui-navbar.component.html',
  styleUrls: ['./ui-navbar.component.scss']
})
export class UiNavbarComponent {

  @Input() displayNextZone = false;
  @Input() displayPhs = false;
  @Input() isBattle = false;

  theme: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public translateService: TranslateService,
    public router: Router
  ) {
    // default theme
    const theme = localStorage.getItem('theme') as Theme;
    this.theme = theme ? theme: Theme.Light;
    this.applyTheme();
  }

  public toggleDark(): void {
    this.theme = this.theme === Theme.Light ? Theme.Dark : Theme.Light;
    this.applyTheme();
  }

    // Show help
  help(): void {
    if (!this.isBattle) {
      this.router.navigateByUrl('game');

      helpData.steps.forEach((step, index) => {
        step.intro = this.translateService.instant(`step${index + 1}`);
      });
      const intro = introJs();
      intro.setOptions(helpData);
      intro.start();
    }
  }

  private applyTheme(): void {
    localStorage.setItem('theme', this.theme);
    const htmlNode = this.document.querySelector('html');
    if (htmlNode) {
      if (this.theme === Theme.Dark) {
        htmlNode.classList.add('dark');
      } else {
        htmlNode.classList.remove('dark');
      }
    }
  }
}
