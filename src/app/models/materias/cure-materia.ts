import { ItAction } from '../../core/interfaces/it-action';
import { Cure } from '../actions/cure';
import { Battle } from '../battle';
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
    return this.pwr + this.level - 1;
  }

  /**
   * Can use the materia?
   */
  canUse(battle: Battle): boolean {
    return (
      battle.characters.mp >= this.getMpCost() &&
      battle.characters.hp() < battle.characters.hpMax
    );
  }

  /**
   * Do materia action
   * Add to HP : +30% to +60%
   */
  getSkill(battle: Battle): ItAction[] {
    const hits = battle.characters.hpMax;
    const cure = new Cure(hits, this.getPwr());
    return [cure];
  }
}
