import { WeaponSave } from '../models/save'
import { WeaponRef } from './refs/weapons'

export abstract class Weapon {

  abstract ref: WeaponRef;
  nbr: number
  equipped: boolean

  abstract name: string;
  abstract type: string;
  abstract hits: number;
  abstract price: number;
  abstract maxMaterias: number;
  abstract zoneAvailable: number;

  constructor() {
    // nbr owned
    this.nbr = 1

    // equipped
    this.equipped = false
  }

  /**
   * Extends
   */
  load(data: WeaponSave): Weapon {
    this.ref = data.ref
    this.nbr = data.nbr
    this.equipped = data.equipped
    return this
  }

  /**
   * Returns the price of the weapon
   */
  getPrice(): number {
    return this.price
  }

  /**
   * Returns the sell price of the weapon
   */
  getSellPrice(): number {
    return this.price / 2
  }

  /**
   * Returns the number of owned
   */
  inStock(weapons: Weapon[]): number { // weapons.list
    let sum = 0
    for (const w of weapons) {
      if (w.name === this.name) {
        sum += w.nbr
      }
    }
    return sum
  }

  /**
   * Returns true if weapon can be equipped
   */
  canEquip(): boolean {
    return true
  }

  /*
  * Save weapon
  */
  export(): WeaponSave {
    const {ref, nbr, equipped} = this
    return {ref, nbr, equipped}
  }

}
