import { Character } from './character';
import { Unit } from './unit';

/**
 * Game state
 */
export class Game {

  saveKey: string;
  rank: number;
  characters: Unit[];
  story: {
    chapter: number;
    part: number;
  };

  /**
   * Returns story progress
   */
  getProgress() {
    return this.story.chapter + '-' + this.story.part;
  }

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
