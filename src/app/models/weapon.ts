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
   * Returns true if weapon can be equipped
   */
  canEquip(): boolean {
    return true;
  }

  /*
   * Save weapon
   */
  export(): WeaponSave {
    const { ref, nbr, equipped } = this;
    return { ref, nbr, equipped };
  }
}
