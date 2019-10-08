import { Character } from './character';

/**
 * Game state
 */
export class Game {

  saveKey: string;
  rank: number;
  characters: Character[];

  /**
   * Export game data to JSON
   */
  export() {
    return {
      rank: this.rank,
      characters: []
    };
  }

}
