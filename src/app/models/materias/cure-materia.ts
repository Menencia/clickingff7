import { BattleService } from 'src/app/core/services/battle.service';
import { Materia } from '../materia';
import { Cure } from '../action-subs/cure';
import { ActionSub } from '../action-sub';

export abstract class CureMateria extends Materia {

  /** MP cost */
  getMpCost(): number {
    return Math.ceil((this.getPwr() + 1) / 20) - 1;
  }

  /** Returns cure materia power */
  getPwr(): number {
    return this.pwr + this.level - 1;
  }

  /** Can use the cure materia? */
  canUse(battleService: BattleService): boolean {
    return (battleService.characters.mp >= this.getMpCost()
      && battleService.characters.hp < battleService.characters.hpMax);
  }

  /** Builds actions to use cure materia */
  getActionSubs(battleService: BattleService): ActionSub[] {
    const hits = battleService.characters.hpMax;
    const cure = new Cure(hits);
    return [cure];
  }

}
