import { GameService } from '../game.service';
import { WeaponSave } from './save';
import { Weapon } from './weapon';

export class Weapons {

  list: Weapon[];

  /**
   * Init
   */
  constructor(public game: GameService) {
    this.game = game;
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

  /**
   * Returns maximum materias that can be equipped
   */
  maxMaterias(): number {
    let maxMaterias = 0;

    const team = this.game.characters.getTeam();

    for (const character of team) {
      const weapon = character.weapon();
      if (weapon) {
        maxMaterias += weapon.maxMaterias;
      }
    }

    return maxMaterias;
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
