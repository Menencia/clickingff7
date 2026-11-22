import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DockComponent } from './shared/components/dock/dock.component';
import { HelpButtonComponent } from './shared/components/help-button/help-button.component';
import { SidemenuComponent } from './shared/components/sidemenu/sidemenu.component';
import { ThemePickerComponent } from './shared/components/theme-picker/theme-picker.component';
import { UpdateBannerComponent } from './shared/components/update-banner/update-banner.component';

@Component({
  selector: 'app-root',
  imports: [
    DockComponent,
    HelpButtonComponent,
    RouterOutlet,
    SidemenuComponent,
    ThemePickerComponent,
    UpdateBannerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
