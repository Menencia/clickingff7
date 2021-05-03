import { Attack } from '../attack';
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
    let pwr = this.pwr + this.level - 1;
    if (this.level === 100) {
      pwr++;
    }
    return pwr;
  }

/**
 * Can use the materia?
 */
  canUse(): boolean {
    return this.game.battle.isBattle && this.game.characters.mp >= this.getMpCost();
  }

  /**
   * Do materia action
   */
  action(): void {
    const hits = this.game.characters.hits;
    const pwr = hits * (1 + (this.getPwr()) / 100);
    const attack = new Attack(Math.ceil(pwr), this.elements);

    super.action(() => {
      this.game.enemies.getAttacked(attack);
    });
}

}
