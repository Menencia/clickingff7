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

  getCurrent(character: Character): Weapon {
    const weapon = this.list.find((w: Weapon) => {
      return w.type === character.weaponType && w.equipped;
    });

    if (!weapon) {
      throw new Error('Weapon not found !');
    }

    return weapon;
  }

  getOthers(character: Character): Weapon[] {
    return this.list.filter((w: Weapon) => {
      return (w.type === character.weaponType && w.name !== this.getCurrent(character).name);
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
