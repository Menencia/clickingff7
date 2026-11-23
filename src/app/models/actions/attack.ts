import { withVariance } from '../../shared/utils/game.utils';
import { random } from '../../shared/utils/math.utils';
import { Context } from '../context';
import { ElementType } from '../element-type';
import { ItActionAttack } from './action';

export class Attack implements ItActionAttack {
  constructor(
    public baseHits: number,
    public pwr: number,
    public elements: ElementType[] = [],
  ) {}

  /** Calculate raw damages */
  calculateHits(): number {
    return this.roll().hits;
  }

  /** Calculate raw damages, telling whether the hit is critical */
  roll(): { hits: number; critical: boolean } {
    // base hits with variance (-+10%)
    const hits = withVariance(this.baseHits * (this.pwr / 100));

    // critical hits (<10%)
    const critical = random(0, 100) <= 10;

    return { hits: critical ? hits * 2 : hits, critical };
  }

  /** How to resolve an materia action attack */
  use(context: Context): void {
    const { hits, critical } = this.roll();
    context.battle?.enemies.getAttacked(hits, this, critical);
  }
}
