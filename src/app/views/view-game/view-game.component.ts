import { Component } from '@angular/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { GameService } from 'src/app/core/services/game.service';
import { Characters } from 'src/app/models/units/characters';
import { Enemies } from 'src/app/models/units/enemies';
import { UiActionsComponent } from 'src/app/shared/ui/ui-actions/ui-actions.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { EnemiesPanelComponent } from './components/enemies-panel/enemies-panel.component';

@Component({
  selector: 'app-view-game',
  standalone: true,
  imports: [
    UiLayoutDefaultComponent,
    UiActionsComponent,
    CharactersPanelComponent,
    EnemiesPanelComponent,
  ],
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.scss'],
})
export class ViewGameComponent {
  public characters: Characters;

  public enemies: Enemies;

  constructor(
    private gameService: GameService,
    private battleService: BattleService,
  ) {
    this.characters = this.gameService.characters;
    this.enemies = this.battleService.enemies;
  }
}
