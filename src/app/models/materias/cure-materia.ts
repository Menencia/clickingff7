import { GameService } from '../../game.service';
import { Cure } from '../cure';
import { Materia } from '../materia';

export abstract class CureMateria extends Materia {

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

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
  canUse(): boolean {
    return (this.game.characters.mp >= this.getMpCost()
      && this.game.characters.hp < this.game.characters.hpMax);
  }

  /**
   * Do materia action
   * Add to HP : +30% to +60%
   */
  action(): void {
    const hpMax = this.game.characters.hpMax;
    const pwr = Math.ceil(hpMax * (this.getPwr() / 100));
    const cure = new Cure(pwr);

    super.action(() => {
      this.game.characters.addHp(cure.getCure());
    });
  }

}
