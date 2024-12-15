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
  constructor(public readonly data: Readonly<WeaponJson>) {}

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
  inStock(weapons: Weapon[]): boolean {
    return weapons.some((w) => w.data.ref === this.data.ref);
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
    return { ref: this.data.ref };
  }
}
