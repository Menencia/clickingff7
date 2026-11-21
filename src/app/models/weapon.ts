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

  ref: WeaponRef;

  type: string;

  hits: number;

  price: number;

  maxMaterias: number;

  zoneAvailable: number;

  constructor(data: WeaponJson) {
    this.ref = data.ref;
    this.type = data.type;
    this.hits = data.hits;
    this.price = data.price;
    this.maxMaterias = data.maxMaterias;
    this.zoneAvailable = data.zoneAvailable;
  }

  /**
   * Extends
   */
  load(data: WeaponSave): Weapon {
    this.nbr = data.nbr;
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
   * Returns the number of owned
   */
  inStock(weapons: Weapon[]): number {
    // weapons.list
    let sum = 0;
    weapons.forEach((w) => {
      if (w.ref === this.ref) {
        sum += w.nbr;
      }
    });
    return sum;
  }

  /**
   * Save weapon. {equipped} is derived from the characters (see
   * Weapons.isEquipped) and only written for 1.5.0 compatibility.
   */
  export(equipped: boolean): WeaponSave {
    const { ref, nbr } = this;
    return { ref, nbr, equipped };
  }
}
