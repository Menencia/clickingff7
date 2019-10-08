import { Injectable } from '@angular/core';
import { Game } from './game';

const PREFIX_SAVE = 'cff7-save-';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  /** Current game */
  game: Game;

  constructor() { }

  /**
   * return true ig a game is currently played
   */
  isConnected() {
    return this.game != null;
  }

  /**
   * Create a new brand game
   */
  newGame() {
    this.game = new Game();
    this.game.rank = 1;
    this.game.characters = [];
    this.game.story = {
      chapter: 1,
      part: 1
    };
  }

  /**
   * Return save keys from localstorage
   */
  getGames() {
    const result = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      if (keys[i].startsWith(PREFIX_SAVE)) {
        result.push(keys[i]);
      }
    }

    return result;
  }

  /**
   * Load a game
   */
  load(saveKey) {
    const saveData = localStorage.getItem(saveKey);
    const save = JSON.parse(saveData);
    this.game = new Game();
    this.game.saveKey = saveKey;
    this.game.rank = save.rank;
    this.game.characters = save.characters;

    const [chapter, part] = save.storyProgress.split('-');
    this.game.story = {chapter, part};
  }

  /**
   * Quit current game
   */
  quit() {
    if (this.game) {
      this.save();
      this.game = null;
    }
  }

  /**
   * Save current game
   */
  save() {
    const key = PREFIX_SAVE + '001';
    const data = this.game.export();
    localStorage.setItem(key, JSON.stringify(data));
  }
}
