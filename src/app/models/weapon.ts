import { GameService } from '../game.service';
import { WeaponSave } from '../models/save';
import { WeaponRef } from './refs/weapons';

export abstract class Weapon {

  abstract ref: WeaponRef;
  nbr: number;
  equipped: boolean;

  abstract name: string;
  abstract type: string;
  abstract hits: number;
  abstract price: number;
  abstract maxMaterias: number;
  abstract zoneAvailable: number;

  constructor(public game: GameService) {
    // nbr owned
    this.nbr = 1;

    // equipped
    this.equipped = false;
  }

  /**
   * Extends
   */
  load(data: WeaponSave): Weapon {
    this.ref = data.ref;
    this.nbr = data.nbr;
    this.equipped = data.equipped;
    return this;
  }

  /**
   * Returns the price of the weapon
   */
  getPrice(): number {
    return this.price;
  }

  /**
   * Returns the sell price of the weapon
   */
  getSellPrice(): number {
    return this.price / 2;
  }

  /**
   * Returns true if the weapon can be bought
   */
  canBuy(): boolean {
    return this.game.gils >= this.getPrice();
  }

  /**
   * Buy the weapon
   */
  buy(): void {
    if (this.canBuy()) {
      this.game.gils -= this.getPrice();
      this.game.weapons.add(this, false);
    }
  }

  /**
   * Returns true if the weapon can be sold
   */
  canSell(): boolean {
    return (this.equipped && this.nbr > 1) || (!this.equipped);
  }

  /**
   * Sell the weapon
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
  inStock(): number {
    let sum = 0;
    for (const w of this.game.weapons.list) {
      if (w.name === this.name) {
          sum += w.nbr;
      }
    }
    return sum;
  }

  /**
   * Returns true if weapon can be equipped
   */
  canEquip(): boolean {
    return true;
  }

  /**
   * Equip a weapon
   */
  equip(refresh = true): void {
    // find current equipped weapon
    const weapon = this.game.weapons.list.find((w: Weapon) => {
      return w.type === this.type && w.equipped === true;
    });

    if (weapon) {
      weapon.equipped = false;
    }

    // then equipped this one
    this.equipped = true;

    if (refresh) {
      this.game.characters.refresh();
    }
  }

  /**
   * Remove one ex. of the weapon
   */
  remove(): void {
    if (this.nbr > 1) {
      this.nbr--;
    } else {
      this.game.weapons.list = this.game.weapons.list.filter(e => e !== this);
    }
  }

  /*
  * Save weapon
  */
  export(): WeaponSave {
    const {ref, nbr, equipped} = this;
    return {ref, nbr, equipped};
  }

}
