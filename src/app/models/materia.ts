import { ItAction } from '../core/interfaces/it-action';
import { BattleService } from '../core/services/battle.service';

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

export abstract class Materia {
  constructor(
    public readonly data: Readonly<MateriaJson>,
    public level = 1,
    public ap = 0,
    public equipped = false,
  ) {}

  abstract getMpCost(): number;

  abstract canUse(battleService: BattleService): boolean;

  abstract getSkill(battleService: BattleService): ItAction[];

  use(battleService: BattleService) {
    this.getSkill(battleService).forEach((action) => action.use(battleService));
  }

  /**
   * Returns the price of the materia
   */
  getPrice(): number {
    return this.data.price;
  }

  /**
   * Returns the sell price of the materia
   */
  getSellPrice(): number {
    return this.data.price / 2;
  }

  /**
   * Returns the number of owned
   */
  inStock(materias: Materia[]): boolean {
    const materia = materias.find((e) => e.data.ref === this.data.ref);
    if (materia) {
      return true;
    }
    return false;
  }

  /**
   *
   */
  getApMax(): number {
    return Math.ceil((((this.ap - 3) * 10) / 100 + 1) * 60 * this.level);
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
    if (this.level < 100) {
      while (this.ap >= this.getApMax()) {
        this.ap -= this.getApMax();
        this.level += 1;
      }
    }
  }

  /**
   * Exports
   */
  export(): MateriaSave {
    const { ap, level, equipped } = this;
    return { ref: this.data.ref, ap, level, equipped };
  }
}
