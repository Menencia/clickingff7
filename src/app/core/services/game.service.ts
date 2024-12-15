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
  timer: number;

  /** List of saves */
  saves: Save[] = [];

  /** Last export */
  lastExport = '';

  /**
   * init
   */
  constructor(
    private langService: LangService,
    private playerService: PlayerService,
  ) {
    // timer
    this.timer = 0;
  }

  run(): void {
    // PRELOAD
    this.preload();

    // search for save
    let save;
    const s = localStorage[SAVE_1];
    if (s) {
      save = JSON.parse(atob(s));
    }

    // load save
    if (save) {
      this.playerService.load(save);
      this.playerService.zones.checkLastZone();
    } else {
      this.reset();
      this.playerService.buildLevel(1);
    }

    // POSTLOAD
    this.postload();
  }

  /**
   * Preload all savable variables
   */
  preload(): void {
    this.playerService.init();
  }

  /**
   * Refresh the game with data loaded
   */
  postload(): void {
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

  /**
   *
   */
  save(): void {
    const s = this.playerService.export();
    this.saves[0] = s;

    const ss = btoa(JSON.stringify(s));
    localStorage[SAVE_1] = ss;
    this.lastExport = ss;
  }

  /**
   * Remove the COOKIE & reset the game
   */
  reset(): void {
    this.saves = [];

    localStorage.removeItem(SAVE_1);
  }
}
