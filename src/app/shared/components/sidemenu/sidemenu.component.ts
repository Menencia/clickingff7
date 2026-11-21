import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import { helpData } from '../../../models/help';
import { PHS_UNLOCK_ZONE } from '../../utils/game.utils';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  private battleService = inject(BattleService);
  private translateService = inject(TranslateService);
  private gameService = inject(GameService);
  private router = inject(Router);

  horizontal = input(false);

  displayNextZone() {
    return this.gameService.zones.isNextZone();
  }

  displayPhs() {
    return this.gameService.zones.levelMax >= PHS_UNLOCK_ZONE;
  }

  async help(): Promise<void> {
    if (this.battleService.battle()) {
      return;
    }

    this.router.navigateByUrl('game');

    helpData.steps.forEach((step, index) => {
      step.intro = this.translateService.instant(`step${index + 1}`);
    });

    // Loaded on demand to keep intro.js out of the initial bundle.
    const { default: introJs } = await import('intro.js');
    introJs().setOptions(helpData).start();
  }
}
