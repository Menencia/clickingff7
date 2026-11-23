import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import { Item } from '../../../models/item';
import { Materia } from '../../../models/materia';
import { MAX_FIGHTS } from '../../../models/zone';
import { ActionIconComponent } from '../action-icon/action-icon.component';

/**
 * Delay (ms) during which the fight buttons stay disabled after a battle:
 * they replace Attack and Escape at the same place, so the last clicks of a
 * battle would otherwise start a new one.
 */
export const FIGHT_COOLDOWN = 1000;

/** Elements whose own keyboard behavior (Space, Enter) must be left alone */
const INTERACTIVE =
  'button, a, input, select, textarea, summary, [contenteditable]';

/** Elements where typing must never trigger a shortcut */
const TEXT_FIELDS = 'input, select, textarea, [contenteditable]';

export type ActionsTab = 'items' | 'magic' | 'battle';

@Component({
  selector: 'app-ui-actions',
  imports: [ActionIconComponent, TranslatePipe],
  templateUrl: './ui-actions.component.html',
  host: { '(document:keydown)': 'onKeydown($event)' },
  styleUrls: ['./ui-actions.component.scss'],
})
export class UiActionsComponent {
  private battleService = inject(BattleService);
  private gameService = inject(GameService);

  /** Open tab of the actions */
  readonly tab = signal<ActionsTab>('battle');

  /** True right after a battle, while the fight buttons are disabled */
  readonly cooldown = signal(false);

  private cooldownTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    let wasBattle = false;
    effect(() => {
      const battle = this.isBattle();
      if (wasBattle && !battle) {
        this.startCooldown();
      }
      wasBattle = battle;
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.cooldownTimer));
  }

  private startCooldown(): void {
    clearTimeout(this.cooldownTimer);
    this.cooldown.set(true);
    this.cooldownTimer = setTimeout(
      () => this.cooldown.set(false),
      FIGHT_COOLDOWN,
    );
  }

  /** Victories still needed in the current zone before the boss shows up */
  public remainingFights(): number {
    return Math.max(MAX_FIGHTS - this.gameService.zones.current().nbFights, 0);
  }

  // Outside a battle, offensive materias and items are hidden.
  public getMaterias(): Materia[] {
    const battle = this.isBattle();
    return this.gameService.materias
      .getEquipped()
      .filter((materia) => battle || !materia.isBattleOnly());
  }

  public getItems(): Item[] {
    const battle = this.isBattle();
    return this.gameService.items
      .getEquipped()
      .filter((item) => battle || !item.isBattleOnly());
  }

  public isBattle(): boolean {
    return !!this.battleService.battle();
  }

  public canFightRandom(): boolean {
    return !this.cooldown() && this.battleService.canFightRandom();
  }

  public fightRandom(): void {
    if (this.canFightRandom()) {
      this.battleService.startRandom();
    }
  }

  public canFightBoss(): boolean {
    return !this.cooldown() && this.battleService.canFightBoss();
  }

  public fightBoss(): void {
    if (this.canFightBoss()) {
      this.battleService.startBoss();
    }
  }

  public attack(): void {
    this.battleService.attack();
  }

  public limit(): void {
    this.battleService.limit();
  }

  public escape(): void {
    this.battleService.escape();
  }

  public canUseMateria(materia: Materia): boolean {
    return this.battleService.canUseMateria(materia);
  }

  public useMateria(materia: Materia): void {
    this.battleService.useMateria(materia);
  }

  public canUseItem(item: Item): boolean {
    return this.battleService.canUseItem(item);
  }

  public useItem(item: Item): void {
    this.battleService.useItem(item);
  }

  public canLimit(): boolean {
    return this.gameService.characters.canLimit();
  }

  /**
   * Keyboard shortcuts of the battle actions: Space or A to attack, L for the
   * Limit, Escape to flee, R for a random fight and B for the boss. Held keys
   * (repeats) and keys with a modifier are ignored.
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(TEXT_FIELDS)) {
      return;
    }
    const key = event.key.toLowerCase();
    // Space on a focused button already clicks it.
    if (key === ' ' && target?.closest(INTERACTIVE)) {
      return;
    }
    const action = this.shortcut(key);
    if (action) {
      event.preventDefault();
      action();
    }
  }

  private shortcut(key: string): (() => void) | undefined {
    if (this.isBattle()) {
      switch (key) {
        case ' ':
        case 'a':
          return () => this.attack();
        case 'l':
          return this.canLimit() ? () => this.limit() : undefined;
        case 'escape':
          return () => this.escape();
      }
      return undefined;
    }
    switch (key) {
      case 'r':
        return () => this.fightRandom();
      case 'b':
        return () => this.fightBoss();
    }
    return undefined;
  }
}
