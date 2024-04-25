import { Units } from 'src/app/models/units';
import { Characters } from 'src/app/models/units/characters';

import { BattleService } from '../services/battle.service';

export class AutoFighting {
  public timer!: ReturnType<typeof setTimeout>;

  constructor(
    public units: Units,
    public battleService: BattleService,
  ) {}

  run(): void {
    this.timer = setTimeout(() => {
      this.units.getAttackSkill().use(this.battleService);

      if (this.getOpponent().isAlive()) {
        this.run();
      } else {
        this.battleService.end(false);
      }
    }, 1000);
  }

  stop(): void {
    clearTimeout(this.timer);
  }

  private getOpponent(): Units {
    if (this.units instanceof Characters) {
      return this.battleService.enemies;
    } else {
      return this.battleService.characters;
    }
  }
}
