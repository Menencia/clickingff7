import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import packageJson from '../../package.json';
import { HelpButtonComponent } from './shared/components/help-button/help-button.component';
import { SidemenuComponent } from './shared/components/sidemenu/sidemenu.component';
import { ThemePickerComponent } from './shared/components/theme-picker/theme-picker.component';
import { UpdateBannerComponent } from './shared/components/update-banner/update-banner.component';
import { UiFooterComponent } from './shared/ui/ui-footer/ui-footer.component';

@Component({
  selector: 'app-root',
  imports: [
    UiFooterComponent,
    HelpButtonComponent,
    RouterOutlet,
    SidemenuComponent,
    ThemePickerComponent,
    UpdateBannerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly drawerToggle =
    viewChild<ElementRef<HTMLInputElement>>('drawerToggle');

  version = packageJson.version;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeDrawer());
  }

  private closeDrawer() {
    const drawer = this.drawerToggle()?.nativeElement;
    if (drawer) drawer.checked = false;
  }
}
