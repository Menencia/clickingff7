import { Materia } from '../materia';
import { MateriaAction } from '../actions/materia';
import { Attack } from '../action-subs/attack';
import { BattleService } from 'src/app/core/services/battle.service';
import { ActionSub } from '../action-sub';

export abstract class AttackMateria extends Materia {

  abstract elements: string[];

  /** MP cost */
  getMpCost(): number {
    return Math.ceil((this.getPwr() + 1) / 50) - 1;
  }

  /** Returns attack materia power */
  getPwr(): number {
    return this.pwr + this.level - 1;
  }

  canUse(battleService: BattleService): boolean {
    return true;
  }

  /** Builds actions to use attack materia */
  getActionSubs(battleService: BattleService): ActionSub[] {
    const hits = battleService.characters.hits;
    const attack = new Attack(
      hits,
      this.getPwr(),
      this.elements
    );
    return [attack];
  }
}
