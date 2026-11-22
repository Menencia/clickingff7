import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';
import { DockComponent } from './shared/components/dock/dock.component';
import { HelpButtonComponent } from './shared/components/help-button/help-button.component';
import { SidemenuComponent } from './shared/components/sidemenu/sidemenu.component';
import { ThemePickerComponent } from './shared/components/theme-picker/theme-picker.component';
import { UpdateBannerComponent } from './shared/components/update-banner/update-banner.component';
import { UiFooterComponent } from './shared/ui/ui-footer/ui-footer.component';

@Component({
  selector: 'app-root',
  imports: [
    DockComponent,
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
  version = packageJson.version;
}
