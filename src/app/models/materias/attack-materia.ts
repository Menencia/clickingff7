import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Attack } from '../actions/attack';
import { Materia, MateriaJson } from '../materia';

export interface AttackMateriaJson extends MateriaJson {
  elements: string[];
}
export class AttackMateria extends Materia {
  public override data!: Readonly<AttackMateriaJson>;

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
    return this.data.pwr + this.level - 1;
  }

  /**
   * Can use the materia?
   */
  canUse(battleService: BattleService): boolean {
    return battleService.isBattle && battleService.team.mp >= this.getMpCost();
  }

  /**
   * Get skill containing battle actions
   */
  getSkill(battleService: BattleService): ItAction[] {
    const { attackFromEquipment: hits } = battleService.team;
    const attack = new Attack(hits, this.getPwr(), this.data.elements);
    return [attack];
  }
}
