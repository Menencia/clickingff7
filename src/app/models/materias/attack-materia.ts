import { BattleService } from 'src/app/services/battle.service'
import { Attack } from '../attack'
import { Materia } from '../materia'

export abstract class AttackMateria extends Materia {

  abstract elements: string[];

  /**
   * MP cost
   */
  getMpCost(): number {
    return Math.ceil((this.getPwr() + 1) / 50) - 1
  }

  /**
   * Return materia power
   */
  getPwr(): number {
    let pwr = this.pwr + this.level - 1
    if (this.level === 100) {
      pwr++
    }
    return pwr
  }

/**
 * Can use the materia?
 */
  canUse(battleService: BattleService): boolean {
    return battleService.isBattle && battleService.characters.mp >= this.getMpCost()
  }

  /**
   * Do materia action
   */
  use(battleService: BattleService): void {
    const hits = battleService.characters.hits
    const pwr = hits * (1 + (this.getPwr()) / 100)
    const attack = new Attack(Math.ceil(pwr), this.elements)
    battleService.enemies.getAttacked(attack)
  }

}
