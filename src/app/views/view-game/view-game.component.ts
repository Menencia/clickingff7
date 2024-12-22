import { Component } from '@angular/core';
import { BattleService } from '@shared/services/battle.service';
import { PlayerService } from '@shared/services/player.service';
import { Team } from '@shared/models/team';
import { Enemies } from '@shared/models/units/enemies';
import { UiActionsComponent } from 'src/app/shared/ui/ui-actions/ui-actions.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { EnemiesPanelComponent } from './components/enemies-panel/enemies-panel.component';

@Component({
  selector: 'app-view-game',
  standalone: true,
  imports: [UiLayoutDefaultComponent, UiActionsComponent, CharactersPanelComponent, EnemiesPanelComponent],
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.scss'],
})
export class ViewGameComponent {
  public team: Team;

  public enemies: Enemies;

  constructor(
    private playerService: PlayerService,
    private battleService: BattleService,
  ) {
    this.team = this.playerService.team;
    this.enemies = this.battleService.enemies;
  }
}
