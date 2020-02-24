import { Injectable } from '@angular/core';
import { SaveService } from './save.service';

const PREFIX_SAVE = 'cff7-save-';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    public save: SaveService
  ) { }

  /**
   * return true ig a game is currently played
   */
  isConnected() {
    return this.save.key != null;
  }

  /**
   * Create a new brand save
   */
  newGame() {
    const key = PREFIX_SAVE + '001';
    this.save.create(key);
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
   * Load a save
   */
  loadSave(key) {
    const item = localStorage.getItem(key);
    const data = JSON.parse(item);
    this.save.load(key, data);
  }

  /**
   * Delete a game
   */
  delete(key) {
    localStorage.removeItem(key);
  }

  /**
   * Quit current game
   */
  quit() {
    if (this.save.key) {
      this.register();
      this.save.key = null;
    }
  }

  /**
   * register current save
   */
  register() {
    const data = this.save.export();
    localStorage.setItem(this.save.key, JSON.stringify(data));
  }
}
