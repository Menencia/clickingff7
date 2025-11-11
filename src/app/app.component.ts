import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuSidebarComponent } from '@shared/components/menu-sidebar/menu-sidebar.component';
import { UiFooterComponent } from '@shared/components/ui-footer/ui-footer.component';
import { UiNavbarComponent } from '@shared/components/ui-navbar/ui-navbar.component';
import { BattleService } from '@shared/services/battle.service';
import { GameService } from '@shared/services/game.service';
import { PlayerService } from '@shared/services/player.service';

import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  imports: [
    UiFooterComponent,
    UiNavbarComponent,
    RouterOutlet,
    MenuSidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidebarVisible = false;

  version = packageJson.version;

  constructor(
    private gameService: GameService,
    public playerService: PlayerService,
    public battleService: BattleService,
  ) {
    const save = this.gameService.searchSave();
    this.gameService.load(save);
  }
}
