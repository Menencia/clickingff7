import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import { Item } from '../../../models/item';
import { Materia } from '../../../models/materia';
import { MAX_FIGHTS } from '../../../models/zone';

@Component({
  selector: 'app-ui-actions',
  imports: [TranslatePipe],
  templateUrl: './ui-actions.component.html',
  styleUrls: ['./ui-actions.component.scss'],
})
export class UiActionsComponent {
  constructor(
    private battleService: BattleService,
    private gameService: GameService,
  ) {}

  public remainingBattles() {
    const remain = MAX_FIGHTS - this.gameService.zones.current().nbFights;
    return remain > 0 ? `(${remain})` : '';
  }

  public getMaterias(): Materia[] {
    return this.gameService.materias.getEquipped();
  }

  public getItems(): Item[] {
    return this.gameService.items.getEquipped();
  }

  public getGils(): number {
    return this.gameService.gils;
  }

  public isBattle(): boolean {
    return !!this.battleService.battle();
  }

  public fightRandom(): void {
    if (!this.isBattle()) {
      this.battleService.startRandom();
    }
  }

  public canFightBoss(): boolean {
    return this.battleService.canFightBoss();
  }

  public fightBoss(): void {
    if (this.battleService.canFightBoss()) {
      this.battleService.startBoss();
    }
  }

  public attack(): void {
    const battle = this.battleService.battle();
    if (battle) {
      this.gameService.characters.getAttackSkill().use(battle);

      if (!battle.enemies.isAlive()) {
        battle.end(true);
      }
    }
  }

  /**
   * Escape fight
   */
  public escape(): void {
    const battle = this.battleService.battle();
    if (battle) {
      battle.end(false);
    }
  }

  public canUseMateria(materia: Materia): boolean {
    const battle = this.battleService.battle();
    return !!battle && materia.canUse(battle);
  }

  public useMateria(materia: Materia): void {
    const battle = this.battleService.battle();
    if (battle) {
      // cost
      if (this.canUseMateria(materia)) {
        this.gameService.characters.mp -= materia.getMpCost();
      } else {
        throw new Error('CANNOT USE');
      }

      // do action
      materia.use(battle);

      if (!battle.enemies.isAlive()) {
        battle.end(true);
      }
    }
  }

  public canUseItem(item: Item): boolean {
    const battle = this.battleService.battle();
    return !!battle && item.canUse(battle);
  }

  public useItem(item: Item): void {
    const battle = this.battleService.battle();
    if (battle) {
      // cost
      if (this.canUseItem(item)) {
        if (item.nbr > 1) {
          item.nbr -= 1;
        } else {
          this.gameService.items.list = this.gameService.items.list.filter(
            (e) => e !== item,
          );
        }
      } else {
        throw new Error('CANNOT USE');
      }

      // do action
      item.use(battle);
    }
  }

  public canLimit(): boolean {
    return this.gameService.characters.canLimit();
  }

  public getZoneLvl(): number {
    return this.gameService.zones.level;
  }
}
