import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Attack } from '../actions/attack';
import { Materia } from '../materia';

export abstract class AttackMateria extends Materia {
  abstract elements: string[];

  /**
   * MP cost
   */
  getMpCost(): number {
    return Math.ceil((this.getPwr() + 1) / 50) - 1;
  }

  /**
   * Return materia power
   */
  getPwr(): number {
    return this.pwr + this.level - 1;
  }

  /**
   * Can use the materia?
   */
  canUse(battleService: BattleService): boolean {
    return (
      battleService.isBattle && battleService.characters.mp >= this.getMpCost()
    );
  }

  /**
   * Get skill containing battle actions
   */
  getSkill(battleService: BattleService): ItAction[] {
    const hits = battleService.characters.hits;
    const attack = new Attack(hits, this.getPwr(), this.elements);
    return [attack];
  }
}
