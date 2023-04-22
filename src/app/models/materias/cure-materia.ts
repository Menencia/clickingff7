import { BattleService } from 'src/app/core/services/battle.service';
import { Cure } from '../cure';
import { Materia } from '../materia';

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
    let level = this.level - 1;
    if (this.level === 100) {
      level++;
    }
    return Math.ceil(this.pwr + level / 100 * 20);
  }

  /**
   * Can use the materia?
   */
  canUse(battleService: BattleService): boolean {
    return (battleService.characters.mp >= this.getMpCost()
      && battleService.characters.hp < battleService.characters.hpMax);
  }

  /**
   * Do materia action
   * Add to HP : +30% to +60%
   */
  use(battleService: BattleService): void {
    const hpMax = battleService.characters.hpMax;
    const pwr = Math.ceil(hpMax * (this.getPwr() / 100));
    const cure = new Cure(pwr);
    battleService.characters.addHp(cure.getCure());
  }

}
