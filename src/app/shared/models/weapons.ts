import { Character } from './character';
import { WeaponSave } from './save';
import { Weapon } from './weapon';

export class Weapons {
  list: Weapon[];

  /**
   * Init
   */
  constructor() {
    this.list = [];
  }

  /**
   * Add a weapon
   */
  add(weapon: Weapon): void {
    this.list.push(weapon);
  }

  getAllWeapons(character: Character): Weapon[] {
    return this.list.filter((w: Weapon) => {
      return w.data.type === character.data.weaponType;
    });
  }

  /**
   * Export all weapons
   */
  export(): WeaponSave[] {
    const json: WeaponSave[] = [];
    this.list.forEach((w) => {
      json.push(w.export());
    });
    return json;
  }
}
