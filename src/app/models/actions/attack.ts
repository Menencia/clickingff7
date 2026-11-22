import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { withVariance } from '../../shared/utils/game.utils';
import { random } from '../../shared/utils/math.utils';
import { Context } from '../context';
import { ElementType } from '../element-type';

export class Attack implements ItActionAttack {
  constructor(
    public baseHits: number,
    public pwr: number,
    public elements: ElementType[] = [],
  ) {}

  /** Calculate raw damages */
  calculateHits(): number {
    // base hits with variance (-+10%)
    let hits = withVariance(this.baseHits * (this.pwr / 100));

    // critical hits (<10%)
    if (random(0, 100) <= 10) {
      hits *= 2;
    }

    return hits;
  }

  /** How to resolve an materia action attack */
  use(context: Context): void {
    context.battle?.enemies.getAttacked(this.calculateHits(), this);
  }
}
