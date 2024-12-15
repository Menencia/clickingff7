import { Injectable } from '@angular/core';
import { Save } from 'src/app/models/save';

import { LangService } from './lang.service';
import { PlayerService } from './player.service';

const SAVE_1 = 'save1';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  /** time counter */
  timer = 0;

  /** List of saves */
  saves: Save[] = [];

  constructor(
    private langService: LangService,
    private playerService: PlayerService,
  ) {}

  /** Starts the game by searching a save & load the game */
  run(): void {
    let save;
    const s = localStorage[SAVE_1];
    if (s) {
      save = JSON.parse(atob(s));
    }

    this.load(save);
  }

  /** Loads the game with a save or not */
  load(save?: Save) {
    this.playerService.init();
    if (save) {
      this.playerService.load(save);
      this.playerService.zones.checkLastZone();
    } else {
      this.reset();
      this.playerService.buildLevel(1);
    }
    this.langService.useLang(this.playerService.language);
    this.playerService.team.refresh();
    this.autoTimer();
  }

  /**
   * Auto-chrono
   */
  autoTimer(): void {
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.playerService.time += 1;
      this.autoTimer();
    }, 1000);
  }

  /** Saves current state of the game */
  save(): void {
    const save = this.playerService.export();
    this.saves.push(save);
    localStorage[SAVE_1] = btoa(JSON.stringify(save));
  }

  /** Removes all saves */
  reset(): void {
    this.saves = [];
    localStorage.removeItem(SAVE_1);
  }
}
