import { random } from 'src/app/utils';
import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

export class Cure implements ItAction {

  constructor(
    private baseHits: number,
    private pwr: number
  ) { }

  /** Calcultae raw cure */
  calculateHits(): number {
    // base hits with variance (-+10%)
    const a = this.baseHits * (this.pwr / 100) * (1 - 10 / 100);
    const b = this.baseHits * (this.pwr / 100) * (1 + 10 / 100);
    let hits = Math.round(random(a, b));

    return hits;
  }

  use(battleService: BattleService): void {
    battleService.characters.addHp(this.calculateHits(), this);
  }

}
