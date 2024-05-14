import { Character } from '../character';
import { CharactersSave } from '../save';

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
