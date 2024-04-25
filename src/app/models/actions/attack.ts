import { ItAction } from '../../core/interfaces/it-action';
import { BattleService } from '../../core/services/battle.service';
import { random } from '../../utils';

export class Attack implements ItAction {
  public critical = false;

  constructor(
    public baseHits: number,
    public pwr: number,
    public type: string[] = [],
  ) {}

  /** Calculate raw damages */
  calculateHits(): number {
    // base hits with variance (-+10%)
    const a = this.baseHits * (this.pwr / 100) * (1 - 10 / 100);
    const b = this.baseHits * (this.pwr / 100) * (1 + 10 / 100);
    let hits = Math.round(random(a, b));

    // critical hits (<10%)
    if (random(0, 100) <= 10) {
      hits *= 2;
      this.critical = true;
    }

    return hits;
  }

  /** How to resolve an materia action attack */
  use(battleService: BattleService): void {
    battleService.enemies.getAttacked(this.calculateHits(), this);
  }
}
