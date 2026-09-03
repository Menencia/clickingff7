import { ItAction } from '../../core/interfaces/it-action';
import { Attack } from '../actions/attack';
import { Battle } from '../battle';
import { Materia, MateriaJson } from '../materia';

export interface AttackMateriaJson extends MateriaJson {
  elements: string[];
}

export class AttackMateria extends Materia {
  elements: string[];

  constructor(data: AttackMateriaJson) {
    super(data);
    this.elements = data.elements;
  }

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
    return this.pwr + this.level - 1;
  }

  /**
   * Can use the materia?
   */
  canUse(battle: Battle): boolean {
    return !!battle && battle.characters.mp >= this.getMpCost();
  }

  /**
   * Get skill containing battle actions
   */
  getSkill(battle: Battle): ItAction[] {
    const { hits } = battle.characters;
    const attack = new Attack(hits, this.getPwr(), this.elements);
    return [attack];
  }
}
