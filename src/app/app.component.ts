import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UiFooterComponent } from '@shared/components/ui-footer/ui-footer.component';
import { UiNavbarComponent } from '@shared/components/ui-navbar/ui-navbar.component';
import { BattleService } from '@shared/services/battle.service';
import { GameService } from '@shared/services/game.service';
import { PlayerService } from '@shared/services/player.service';

import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  imports: [UiFooterComponent, UiNavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('drawerToggle') drawerToggle?: ElementRef;

  version = packageJson.version;

  constructor(
    private gameService: GameService,
    public playerService: PlayerService,
    public battleService: BattleService,
    private router: Router,
  ) {
    const save = this.gameService.searchSave();
    this.gameService.load(save);

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const drawer = this.drawerToggle?.nativeElement;
        if (drawer) drawer.checked = false;
      }
    });
  }
}
