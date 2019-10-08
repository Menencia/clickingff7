import { Character } from './character';

/**
 * Game state
 */
export class Game {

  saveKey: string;
  rank: number;
  characters: Character[];
  story: {
    chapter: number;
    part: number;
  };

  /**
   * Export game data to JSON
   */
  export() {
    return {
      rank: this.rank,
      characters: [],
      storyProgress: [this.story.chapter, this.story.part].join('-')
    };
  }

}
