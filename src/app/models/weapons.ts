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
    const w = this.list.find(e => e.name === weapon.name);
    if (w) {
      w.nbr++;
    } else {
      weapon.equipped = (weapon.canEquip()) ? equipped : false;
      this.list.push(weapon);
    }
  }

  getOthers(character: Character): Weapon[] {
    return this.list.filter((w: Weapon) => {
      return (w.type === character.weaponType && w.name !== character.weapon.name);
    });
  }

  /**
   * Export all weapons
   */
  export(): WeaponSave[] {
    const json = [];
    for (const w of this.list) {
      json.push(w.export());
    }
    return json;
  }

}
