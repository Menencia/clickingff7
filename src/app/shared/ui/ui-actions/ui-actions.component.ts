import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { GameService } from 'src/app/core/services/game.service';
import { Item } from 'src/app/models/item';
import { Materia } from 'src/app/models/materia';
import { MAX_FIGHTS } from 'src/app/models/zone';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-ui-actions',
  standalone: true,
  imports: [TranslateModule, ButtonComponent],
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
    return this.battleService.isBattle;
  }

  public fightRandom(): void {
    if (!this.battleService.isBattle) {
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
    if (this.battleService.isBattle) {
      this.gameService.team.getAttackSkill().use(this.battleService);

      if (!this.battleService.enemies.isAlive()) {
        this.battleService.end(true);
      }
    }
  }

  /**
   * Escape fight
   */
  public escape(): void {
    if (this.battleService.isBattle) {
      this.battleService.end(false);
    }
  }

  public canUseMateria(materia: Materia): boolean {
    return materia.canUse(this.battleService);
  }

  public useMateria(materia: Materia): void {
    // cost
    if (this.canUseMateria(materia)) {
      this.gameService.team.mp -= materia.getMpCost();
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    materia.use(this.battleService);

    if (!this.battleService.enemies.isAlive()) {
      this.battleService.end(true);
    }
  }

  public canUseItem(item: Item): boolean {
    return item.canUse(this.battleService);
  }

  public useItem(item: Item): void {
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
    item.use(this.battleService);
  }

  public canLimit(): boolean {
    return this.gameService.team.canLimit();
  }

  public getZoneLvl(): number {
    return this.gameService.zones.level;
  }
}
