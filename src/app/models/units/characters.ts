import { Character } from '../character';
import { CharactersSave } from '../save';
import { Weapon } from '../weapon';

// maximum characters in the team
export const MAX_TEAM = 3;

export class Characters {
  list: Character[] = [];

  /**
   * Add a character
   */
  add(character: Character): void {
    this.list.push(character);
  }

  /** True if weapon is equipped by at least one character */
  isWeaponEquipped(weapon: Weapon): boolean {
    return this.list.some((character) => character.weapon.data.ref === weapon.data.ref);
  }

  /**
   * Returns data for export
   */
  export(): CharactersSave {
    const res: CharactersSave = {
      list: [],
    };

    this.list.forEach((c) => {
      res.list.push(c.export());
    });

    return res;
  }
}
