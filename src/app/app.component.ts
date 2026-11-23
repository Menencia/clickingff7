import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from './core/services/game.service';
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
    TranslatePipe,
    UpdateBannerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly gils = inject(GameService).gils;
}
