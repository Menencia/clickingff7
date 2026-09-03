import { ItAction } from '../../core/interfaces/it-action';
import { random } from '../../shared/utils/math.utils';
import { Battle } from '../battle';

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
  use(battle: Battle): void {
    battle.enemies.getAttacked(this.calculateHits(), this);
  }
}
