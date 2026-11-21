import { ItAction } from '../core/interfaces/it-action';
import { MAX_LEVEL, statFactor } from '../shared/utils/game.utils';
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

  zoneAvailable: number;

  /**
   * Init
   */
  constructor(data: MateriaJson) {
    super(data.price);
    this.ref = data.ref;
    this.type = data.type;
    this.color = data.color;
    this.apBase = data.ap;
    this.pwr = data.pwr;
    this.zoneAvailable = data.zoneAvailable;
  }

  /**
   * Extends
   */
  load(data: MateriaSave): Materia {
    this.ref = data.ref;
    this.level = data.level;
    this.ap = data.ap;
    this.equipped = data.equipped;
    return this;
  }

  abstract getMpCost(): number;

  abstract canUse(context: Context): boolean;

  abstract getSkill(context: Context): ItAction[];

  use(context: Context) {
    this.getSkill(context).map((action) => action.use(context));
  }

  /**
   * Returns true if a materia with the same ref is in {materias}
   */
  isOwned(materias: Materia[]): boolean {
    const materia = materias.find((e) => e.ref === this.ref);
    if (materia) {
      return true;
    }
    return false;
  }

  /**
   *
   */
  getApMax(): number {
    return Math.ceil(statFactor(this.apBase) * 60 * this.level);
  }

  /**
   *
   */
  apProgress(pixelsMax: number): number {
    return this.ap === 0 ? 0 : (this.ap / this.getApMax()) * pixelsMax;
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
