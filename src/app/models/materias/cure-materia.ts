import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Cure } from '../actions/cure';
import { Materia } from '../materia';

export class CureMateria extends Materia {
  /**
   * MP cost
   */
  getMpCost(): number {
    return Math.ceil((this.getPwr() + 1) / 20) - 1;
  }

  /**
   * Return materia power
   */
  getPwr(): number {
    return this.data.pwr + this.level - 1;
  }

  /**
   * Can use the materia?
   */
  canUse(battleService: BattleService): boolean {
    return battleService.team.mp >= this.getMpCost() && battleService.team.hp < battleService.team.hpMax;
  }

  /**
   * Do materia action
   * Add to HP : +30% to +60%
   */
  getSkill(battleService: BattleService): ItAction[] {
    const hits = battleService.team.hpMax;
    const cure = new Cure(hits, this.getPwr());
    return [cure];
  }
}
