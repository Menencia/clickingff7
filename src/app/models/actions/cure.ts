import { ItAction } from '../../core/interfaces/it-action';
import { random } from '../../shared/utils/math.utils';
import { Context } from '../context';

export class Cure implements ItAction {
  constructor(
    private baseHits: number,
    private pwr: number,
  ) {}

  /** Calcultae raw cure */
  calculateHits(): number {
    // base hits with variance (-+10%)
    const a = this.baseHits * (this.pwr / 100) * (1 - 10 / 100);
    const b = this.baseHits * (this.pwr / 100) * (1 + 10 / 100);
    const hits = Math.round(random(a, b));

    return hits;
  }

  use(context: Context): void {
    context.characters.addHp(this.calculateHits());
  }
}
