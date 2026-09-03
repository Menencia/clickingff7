import { Component, computed, Signal } from '@angular/core';
import { BattleService } from '../../core/services/battle.service';
import { GameService } from '../../core/services/game.service';
import { Characters } from '../../models/units/characters';
import { Enemies } from '../../models/units/enemies';
import { UiActionsComponent } from '../../shared/ui/ui-actions/ui-actions.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';
import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { EnemiesPanelComponent } from './components/enemies-panel/enemies-panel.component';

@Component({
  selector: 'app-view-game',
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

  public enemies: Signal<Enemies | undefined>;

  constructor(
    private gameService: GameService,
    private battleService: BattleService,
  ) {
    this.characters = this.gameService.characters;
    this.enemies = computed(() => {
      const battle = this.battleService.battle();
      return battle?.enemies;
    });
  }
}
