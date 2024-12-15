import { Injectable } from '@angular/core';
import { Save } from 'src/app/models/save';

import { BattleService } from './battle.service';
import { LangService } from './lang.service';
import { PlayerService } from './player.service';

const SAVE_1 = 'save1';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  /** List of saves */
  saves: Save[] = [];

  constructor(
    private langService: LangService,
    private playerService: PlayerService,
    private battleService: BattleService,
  ) {}

  /** Returns existing save if any */
  searchSave(): Save | undefined {
    let save;
    const s = localStorage[SAVE_1];
    if (s) {
      save = JSON.parse(atob(s));
      this.saves[0] = save;
    }
    return save;
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
    this.battleService.team = this.playerService.team;
  }

  /** Saves current state of the game */
  save(): void {
    const save = this.playerService.export();
    this.saves[0] = save;
    localStorage[SAVE_1] = btoa(JSON.stringify(save));
  }

  /** Removes all saves */
  reset(): void {
    this.saves = [];
    localStorage.removeItem(SAVE_1);
  }
}
