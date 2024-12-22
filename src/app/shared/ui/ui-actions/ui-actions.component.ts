import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { PlayerService } from 'src/app/core/services/player.service';
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
    private playerService: PlayerService,
  ) {}

  public remainingBattles() {
    const remain = MAX_FIGHTS - this.playerService.zones.current().nbFights;
    return remain > 0 ? `(${remain})` : '';
  }

  public getMaterias(): Materia[] {
    return this.playerService.materias.getEquipped();
  }

  public getItems(): Item[] {
    return this.playerService.items.getEquipped();
  }

  public getGils(): number {
    return this.playerService.gils;
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

  public fightBoss() {
    if (this.battleService.canFightBoss()) {
      this.battleService.startBoss();
    }
  }

  public canPlay(): boolean {
    return this.battleService.isPlayerTurn && !this.battleService.actionOngoing;
  }

  public async attack(): Promise<void> {
    await this.playerService.team.useAttackSkill(this.battleService);
  }

  public escape() {
    this.battleService.end(false);
  }

  public canUseMateria(materia: Materia): boolean {
    return (this.battleService.isBattle || materia.data.useOutsideBattle) && materia.canUse(this.battleService);
  }

  public async useMateria(materia: Materia): Promise<void> {
    // cost
    if (this.canUseMateria(materia)) {
      this.playerService.team.mp -= materia.getMpCost();
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    await materia.use(this.battleService);
  }

  public canUseItem(item: Item): boolean {
    return item.canUse(this.battleService);
  }

  public async useItem(item: Item): Promise<void> {
    // cost
    if (this.canUseItem(item)) {
      if (item.nbr > 1) {
        item.nbr -= 1;
      } else {
        this.playerService.items.list = this.playerService.items.list.filter((e) => e !== item);
      }
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    await item.use(this.battleService);
  }

  public canLimit(): boolean {
    return this.playerService.team.canLimit();
  }

  public getZoneLvl(): number {
    return this.playerService.zones.level;
  }
}
