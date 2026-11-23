import { MAX_LEVEL, statFactor } from '../shared/utils/game.utils';
import { percent } from '../shared/utils/math.utils';
import { ItAction } from './actions/action';
import { Context } from './context';
import { Purchasable } from './purchasable';

import { MateriaRef } from './refs/materias';
import { MateriaSave } from './save';

export interface MateriaJson {
  ref: MateriaRef;
  type: string;
  color: string;
  price: number;
  ap: number;
  pwr: number;
  zoneAvailable: number;
}

export abstract class Materia extends Purchasable {
  level = 1;

  ap = 0;

  equipped = false;

  ref: MateriaRef;

  type: string;

  color: string;

  apBase: number;

  pwr: number;

  /**
   * Init
   */
  constructor(data: MateriaJson) {
    super(data);
    this.ref = data.ref;
    this.type = data.type;
    this.color = data.color;
    this.apBase = data.ap;
    this.pwr = data.pwr;
  }

  /**
   * Extends
   */
  load(data: MateriaSave): Materia {
    this.level = data.level;
    this.ap = data.ap;
    this.equipped = data.equipped;
    return this;
  }

  /**
   * Power, raised by one per level above 1
   */
  getPwr(): number {
    return this.pwr + this.level - 1;
  }

  abstract getMpCost(): number;

  abstract canUse(context: Context): boolean;

  /**
   * Only shown in the action bar during a battle (offensive magic)
   */
  isBattleOnly(): boolean {
    return false;
  }

  abstract getSkill(context: Context): ItAction[];

  use(context: Context) {
    this.getSkill(context).map((action) => action.use(context));
  }

  /**
   * Returns true if a materia with the same ref is in {materias}
   */
  isOwned(materias: Materia[]): boolean {
    return materias.some((e) => e.ref === this.ref);
  }

  /**
   *
   */
  getApMax(): number {
    return Math.ceil(statFactor(this.apBase) * 60 * this.level);
  }

  /**
   * Returns the percentage of AP progression
   */
  apProgress(): number {
    return percent(this.ap, this.getApMax());
  }

  /**
   *
   */
  setAp(ap: number): void {
    this.ap += ap;
    while (this.level < MAX_LEVEL && this.ap >= this.getApMax()) {
      this.ap -= this.getApMax();
      this.level += 1;
    }
  }

  /**
   * Exports
   */
  export(): MateriaSave {
    const { ref, ap, level, equipped } = this;
    return { ref, ap, level, equipped };
  }
}
