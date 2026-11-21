import { Component, computed, inject, Signal } from '@angular/core';
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
  private gameService = inject(GameService);
  private battleService = inject(BattleService);

  public characters: Characters;

  public enemies: Signal<Enemies>;

  // Without a battle, an empty group keeps the panel (and the tutorial's
  // #step5 anchor) displayed with its "No enemies" state. Built outside the
  // computed: the Enemies constructor writes to signals.
  private readonly noEnemies = new Enemies();

  constructor() {
    this.characters = this.gameService.characters;
    this.enemies = computed(
      () => this.battleService.battle()?.enemies ?? this.noEnemies,
    );
  }
}
