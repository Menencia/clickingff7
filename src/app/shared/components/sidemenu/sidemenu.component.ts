import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import { helpData } from '../../../models/help';
import { PHS_UNLOCK_ZONE } from '../../utils/game.utils';

// declare this to by pass typescript error
// can put this in index.d.ts file
declare const introJs: () => {
  setOptions: (data: unknown) => void;
  start: () => void;
};

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

  help(): void {
    if (!this.battleService.battle()) {
      this.router.navigateByUrl('game');

      helpData.steps.forEach((step, index) => {
        step.intro = this.translateService.instant(`step${index + 1}`);
      });
      const intro = introJs();
      intro.setOptions(helpData);
      intro.start();
    }
  }
}
