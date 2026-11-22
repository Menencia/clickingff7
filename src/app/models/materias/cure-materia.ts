import { ItAction } from '../../core/interfaces/it-action';
import { Cure } from '../actions/cure';
import { Context } from '../context';
import { Materia } from '../materia';

export class CureMateria extends Materia {
  /**
   * MP cost
   */
  getMpCost(): number {
    return Math.ceil((this.getPwr() + 1) / 20) - 1;
  }

  /**
   * Can use the materia?
   */
  canUse(context: Context): boolean {
    return (
      context.characters.mp() >= this.getMpCost() &&
      context.characters.hp() < context.characters.hpMax()
    );
  }

  /**
   * Do materia action
   * Restores getPwr()% of max HP (±10%)
   */
  getSkill(context: Context): ItAction[] {
    const hits = context.characters.hpMax();
    const cure = new Cure(hits, this.getPwr());
    return [cure];
  }
}
