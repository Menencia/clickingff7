import { WeaponRef } from './refs/weapons';
import { WeaponSave } from './save';

export interface WeaponJson {
  ref: WeaponRef;
  type: string;
  hits: number;
  price: number;
  maxMaterias: number;
  zoneAvailable: number;
}

export class Weapon {
  nbr = 1;

  equipped = false;

  constructor(public readonly data: Readonly<WeaponJson>) {}

  /**
   * Extends
   */
  load(data: WeaponSave) {
    this.nbr = data.nbr;
    this.equipped = data.equipped;
  }

  /**
   * Returns the price of the weapon
   */
  getPrice(): number {
    return this.data.price;
  }

  /**
   * Returns the sell price of the weapon
   */
  getSellPrice(): number {
    return this.data.price / 2;
  }

  /**
   * Returns the number of owned
   */
  inStock(weapons: Weapon[]): number {
    // weapons.list
    let sum = 0;
    weapons.forEach((w) => {
      if (w.data.ref === this.data.ref) {
        sum += w.nbr;
      }
    });
    return sum;
  }

  /**
   * Returns true if weapon can be equipped
   */
  canEquip(): boolean {
    return true;
  }

  /*
   * Save weapon
   */
  export(): WeaponSave {
    const { nbr, equipped } = this;
    return { ref: this.data.ref, nbr, equipped };
  }
}
