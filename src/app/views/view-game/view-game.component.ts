import { Component, computed } from '@angular/core';
import { UiActionsComponent } from '@shared/components/ui-actions/ui-actions.component';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Team } from '@shared/models/team';
import { BattleService } from '@shared/services/battle.service';
import { PlayerService } from '@shared/services/player.service';

import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { EnemiesPanelComponent } from './components/enemies-panel/enemies-panel.component';

@Component({
    selector: 'app-view-game',
    imports: [UiLayoutDefaultComponent, UiActionsComponent, CharactersPanelComponent, EnemiesPanelComponent],
    templateUrl: './view-game.component.html',
    styleUrls: ['./view-game.component.scss']
})
export class ViewGameComponent {
  team: Team;

  enemies = computed(() => {
    const battle = this.battleService.battle();
    return battle?.enemies;
  });

  constructor(
    private playerService: PlayerService,
    private battleService: BattleService,
  ) {
    this.team = this.playerService.team;
  }
}
