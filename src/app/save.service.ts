import { Injectable } from '@angular/core';
import { Cloud } from './units/cloud';
import { Unit } from './unit';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  key: string;
  rank: number;
  gems: number;
  gils: number;
  exp: number;
  characters: Unit[];
  story: {
    chapter: number;
    part: number;
  };


  constructor() { }

  create(key) {
    this.key = key;
    this.rank = 1;
    this.gems = 0;
    this.gils = 0;
    this.exp = 0;
    this.characters = [
      new Cloud()
    ];
    this.story = {
      chapter: 1,
      part: 1
    };
  }

  load(key, data) {
    this.key = key;
    this.rank = data.rank;
    this.characters = data.characters;

    const [chapter, part] = data.storyProgress.split('-');
    this.story = {chapter, part};
  }

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
      gems: this.rank,
      gils: this.rank,
      exp: this.exp,
      characters: [],
      storyProgress: [this.story.chapter, this.story.part].join('-')
    };
  }
}
