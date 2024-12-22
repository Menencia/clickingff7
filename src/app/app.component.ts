import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import packageJson from '../../package.json';

import { MenuSidebarComponent } from './core/components/menu-sidebar/menu-sidebar.component';
import { BattleService } from './shared/services/battle.service';
import { GameService } from './shared/services/game.service';
import { PlayerService } from './shared/services/player.service';
import { UiFooterComponent } from './shared/ui/ui-footer/ui-footer.component';
import { UiNavbarComponent } from './shared/ui/ui-navbar/ui-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiFooterComponent, UiNavbarComponent, RouterOutlet, MenuSidebarComponent],
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
