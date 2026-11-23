import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BattleService } from '../../core/services/battle.service';
import { GameService } from '../../core/services/game.service';
import { Characters } from '../../models/units/characters';
import { Enemies } from '../../models/units/enemies';
import { UiActionsComponent } from '../../shared/ui/ui-actions/ui-actions.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';
import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { EnemiesPanelComponent } from './components/enemies-panel/enemies-panel.component';

/**
 * Time (ms) a defeated enemy stays displayed after the battle, so that the
 * last hit can be seen (same length as the hit animation)
 */
export const DEFEAT_DISPLAY = 1000;

@Component({
  selector: 'app-view-game',
  imports: [
    UiLayoutDefaultComponent,
    UiActionsComponent,
    CharactersPanelComponent,
    EnemiesPanelComponent,
    RouterLink,
    TranslatePipe,
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
  // enemies anchor) displayed with its "No enemies" state. Built outside the
  // computed: the Enemies constructor writes to signals.
  private readonly noEnemies = new Enemies();

  /** Enemies just defeated, still displayed for a moment */
  private readonly defeated = signal<Enemies | undefined>(undefined);

  private defeatTimer?: ReturnType<typeof setTimeout>;

  public zoneLevel(): number {
    return this.gameService.zones.level;
  }

  /** True when the next zone can be reached */
  public displayNextZone(): boolean {
    return this.gameService.zones.isNextZone();
  }

  constructor() {
    this.characters = this.gameService.characters;
    this.enemies = computed(
      () =>
        this.battleService.battle()?.enemies ??
        this.defeated() ??
        this.noEnemies,
    );

    // After a victory, keep the defeated enemies until the last hit has been
    // shown. After an escape or a defeat, clear the panel right away.
    let fought: Enemies | undefined;
    effect(() => {
      const battle = this.battleService.battle();
      clearTimeout(this.defeatTimer);
      if (battle) {
        fought = battle.enemies;
        this.defeated.set(undefined);
        return;
      }
      const won = fought && untracked(() => !fought?.isAlive());
      if (fought && won) {
        this.defeated.set(fought);
        this.defeatTimer = setTimeout(
          () => this.defeated.set(undefined),
          DEFEAT_DISPLAY,
        );
      }
      fought = undefined;
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.defeatTimer));
  }
}
