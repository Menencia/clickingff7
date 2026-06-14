import { Component, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { helpData } from '@shared/models/help';
import { BattleService } from '@shared/services/battle.service';
import { PlayerService } from '@shared/services/player.service';

// declare this to by pass typescript error
// can put this in index.d.ts file
declare const introJs: () => {
  setOptions: (data: unknown) => void;
  start: () => void;
};

@Component({
  selector: 'app-ui-navbar',
  imports: [TranslateModule, RouterModule],
  templateUrl: './ui-navbar.component.html',
})
export class UiNavbarComponent {
  horizontal = input(false);

  constructor(
    private battleService: BattleService,
    private translateService: TranslateService,
    private playerService: PlayerService,
    private router: Router,
  ) {}

  displayNextZone() {
    return this.playerService.zones.nextZone;
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
