import { Component, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { convertEffects } from '@shared/models/effect-converter';
import { executeSkill } from '@shared/models/effect-executor';
import { Item } from '@shared/models/item';
import { Materia } from '@shared/models/materia';
import { MAX_FIGHTS } from '@shared/models/zone';
import { BattleService } from '@shared/services/battle.service';
import { PlayerService } from '@shared/services/player.service';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-ui-actions',
  standalone: true,
  imports: [TranslateModule, ButtonComponent],
  templateUrl: './ui-actions.component.html',
  styleUrls: ['./ui-actions.component.scss'],
})
export class UiActionsComponent {
  battle = computed(() => this.battleService.battle());

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

  public fightRandom(): void {
    if (!this.battleService.battle()) {
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
    return this.battleService.canPlay();
  }

  public async attack(): Promise<void> {
    const battle = this.battleService.battle();
    if (!battle) {
      throw new Error('CANNOT USE');
    }
    const effects = convertEffects(this.playerService.team.getAttackRawEffects());
    await executeSkill(battle, effects);
    battle.nextTurn();
  }

  public escape() {
    const battle = this.battleService.battle();
    if (!battle) {
      throw new Error('CANNOT USE');
    }
    battle.end(false);
  }

  public canUseMateria(materia: Materia): boolean {
    const battle = this.battleService.battle();
    return !!battle && materia.canUse(battle) && !battle.actionOngoing;
  }

  public async useMateria(materia: Materia): Promise<void> {
    const battle = this.battleService.battle();
    if (!battle) {
      throw new Error('CANNOT USE');
    }
    // cost
    if (this.canUseMateria(materia)) {
      this.playerService.team.mp -= materia.getMpCost();
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    await materia.use(battle);
  }

  public canUseItem(item: Item): boolean {
    const battle = this.battleService.battle();
    return !!battle && item.canUse(battle) && !battle.actionOngoing;
  }

  public async useItem(item: Item): Promise<void> {
    const battle = this.battleService.battle();
    if (!battle) {
      throw new Error('CANNOT USE');
    }

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
    await item.use(battle);
  }

  public canLimit(): boolean {
    return this.playerService.team.canLimit();
  }

  public getZoneLvl(): number {
    return this.playerService.zones.level;
  }
}
