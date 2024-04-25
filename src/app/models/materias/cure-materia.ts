import { BattleService } from 'src/app/core/services/battle.service';
import { Cure } from '../actions/cure';
import { Materia } from '../materia';
import { ItAction } from 'src/app/core/interfaces/it-action';

export abstract class CureMateria extends Materia {
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
  canUse(battleService: BattleService): boolean {
    return (
      battleService.characters.mp >= this.getMpCost() &&
      battleService.characters.hp < battleService.characters.hpMax
    );
  }

  /**
   * Do materia action
   * Add to HP : +30% to +60%
   */
  getSkill(battleService: BattleService): ItAction[] {
    const hits = battleService.characters.hpMax;
    const cure = new Cure(hits, this.getPwr());
    return [cure];
  }
}
