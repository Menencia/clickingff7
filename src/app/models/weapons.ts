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
  add(weapon: Weapon, equipped = false): void {
    const w = this.list.find((e) => e.ref === weapon.ref);
    if (w) {
      w.nbr += 1;
    } else {
      weapon.equipped = weapon.canEquip() ? equipped : false;
      this.list.push(weapon);
    }
  }

  getAllWeapons(character: Character): Weapon[] {
    return this.list.filter((w: Weapon) => {
      return w.type === character.weaponType;
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
