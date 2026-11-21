import { Purchasable } from './purchasable';
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

export class Weapon extends Purchasable {
  nbr = 1;

  ref: WeaponRef;

  type: string;

  hits: number;

  maxMaterias: number;

  zoneAvailable: number;

  constructor(data: WeaponJson) {
    super(data.price);
    this.ref = data.ref;
    this.type = data.type;
    this.hits = data.hits;
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
   * Save weapon. {equipped} is derived from the characters (see
   * Weapons.isEquipped) and only written for 1.5.0 compatibility.
   */
  export(equipped: boolean): WeaponSave {
    const { ref, nbr } = this;
    return { ref, nbr, equipped };
  }
}
