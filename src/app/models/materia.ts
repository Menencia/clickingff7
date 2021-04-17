import { GameService } from '../game.service';
import { MateriaRef } from './loaders/materia-loader';
import { MateriaSave } from './save';

export abstract class Materia {

  ref: MateriaRef;
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
  constructor(public game: GameService) {
    this.ref = this.constructor.name as MateriaRef;

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

  /**
   *
   */
  abstract canUse(): boolean;

  /**
   *
   */
  abstract getMpCost(): number;

  /**
   * Executes materia action
   */
  action(fn = () => {}): void {
    // cost
    if (this.canUse()) {
      this.game.characters.mp -= this.getMpCost();
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    fn();
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
   * Returns true if the materia can be bought
   */
  canBuy(): boolean {
    return (this.game.gils >= this.getPrice());
  }

  /**
   * Buy the materia
   */
  buy(): void {
    if (this.canBuy()) {
      this.game.gils -= this.getPrice();
      this.game.materias.add(this);
    }
  }

  /**
   * Returns true if the materia can be sold
   */
  canSell(): boolean {
    return (true);
  }

  /**
   * Sell the materia
   */
  sell(): void {
    if (this.canSell()) {
      this.game.gils += this.getSellPrice();
      this.remove();
    }
  }

  /**
   * Returns the number of owned
   */
  inStock(): boolean {
    const materia = this.game.materias.list.filter(e => e.name = this.name);
    if (materia) {
      return true;
    }
    return false;
  }

  /**
   *
   */
  getApMax(): number {
    return Math.ceil(((this.apBase - 3) * 10 / 100 + 1) * 60 * this.level);
  }

  /**
   *
   */
  apProgress(pixelsMax: number): number {
    return (this.ap === 0 ? 0 : this.ap / this.getApMax() * pixelsMax);
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
   * Returns true if the materia can be equipped
   */
  canEquip(): boolean {
    return (this.game.materias.getEquipped().length < this.game.weapons.maxMaterias());
  }

  /**
   * Equip the materia
   */
  equip(refresh = true): void {
    this.equipped = true;

    if (refresh) {
      this.game.characters.refresh();
    }
  }

  /**
   * Unequip the materia
   */
  unequip(refresh = true): void {
    this.equipped = false;

    if (refresh) {
      this.game.characters.refresh();
    }
  }

  /**
   * Remove one ex. of the materia
   */
  remove(): void {
    this.game.materias.list = this.game.materias.list.filter(e => e !== this);
  }

  /**
   * Exports
   */
  export(): MateriaSave {
    const {ref, ap, level, equipped} = this;
    return {ref, ap, level, equipped};
  }

}
