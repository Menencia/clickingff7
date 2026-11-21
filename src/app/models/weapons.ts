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
    const w = this.list.find((e) => e.ref === weapon.ref);
    if (w) {
      w.nbr += 1;
    } else {
      this.list.push(weapon);
    }
  }

  /**
   * Returns true if one of the characters wields the weapon
   */
  isEquipped(weapon: Weapon, characters: Character[]): boolean {
    return characters.some((c) => c.weapon.ref === weapon.ref);
  }

  getAllWeapons(character: Character): Weapon[] {
    return this.list.filter((w: Weapon) => {
      return w.type === character.weaponType;
    });
  }

  /**
   * Export all weapons
   */
  export(characters: Character[]): WeaponSave[] {
    return this.list.map((w) => w.export(this.isEquipped(w, characters)));
  }
}
