import { ItAction } from '../actions/action';
import { Attack } from '../actions/attack';
import { Context } from '../context';
import { ElementType } from '../element-type';
import { Materia, MateriaJson } from '../materia';

export interface AttackMateriaJson extends MateriaJson {
  elements: ElementType[];
}

export class AttackMateria extends Materia {
  elements: ElementType[];

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
   * Can use the materia?
   */
  canUse(context: Context): boolean {
    return !!context.battle && context.characters.mp() >= this.getMpCost();
  }

  override isBattleOnly(): boolean {
    return true;
  }

  /**
   * Get skill containing battle actions
   */
  getSkill(context: Context): ItAction[] {
    const attack = new Attack(
      context.characters.hits(),
      this.getPwr(),
      this.elements,
    );
    return [attack];
  }
}
