import { ItAction } from '../core/interfaces/it-action';
import { BattleService } from '../core/services/battle.service';
import { MateriaRef } from './refs/materias';
import { MateriaSave } from './save';

export abstract class Materia {
  abstract ref: MateriaRef;
  level: number;
  ap: number;
  equipped: boolean;

  abstract name: string;
  abstract color: string;
  abstract price: number;
  abstract apBase: number;
  abstract pwr: number;
  abstract zoneAvailable: number;

  /**
   * Init
   */
  constructor() {
    // current level
    this.level = 1;

    // needed to upgrade
    this.ap = 0;

    // nbr equipped
    this.equipped = false;
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

  abstract canUse(battleService: BattleService): boolean;

  abstract getSkill(battleService: BattleService): ItAction[];

  use(battleService: BattleService) {
    const actions = this.getSkill(battleService);
    for (const action of actions) {
      action.use(battleService);
    }
  }

  /**
   * Returns the price of the materia
   */
  getPrice(): number {
    return this.price;
  }

  /**
   * Returns the sell price of the materia
   */
  getSellPrice(): number {
    return this.price / 2;
  }

  /**
   * Returns the number of owned
   */
  inStock(materias: Materia[]): boolean {
    const materia = materias.find((e) => e.name === this.name);
    if (materia) {
      return true;
    }
    return false;
  }

  /**
   *
   */
  getApMax(): number {
    return Math.ceil((((this.apBase - 3) * 10) / 100 + 1) * 60 * this.level);
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
    const { ref, ap, level, equipped } = this;
    return { ref, ap, level, equipped };
  }
}
