import { withVariance } from '../../shared/utils/game.utils';
import { Context } from '../context';
import { ItAction } from './action';

export class Cure implements ItAction {
  constructor(
    private baseHits: number,
    private pwr: number,
  ) {}

  /** Calcultae raw cure */
  calculateHits(): number {
    // base hits with variance (-+10%)
    return withVariance(this.baseHits * (this.pwr / 100));
  }

  use(context: Context): void {
    context.characters.addHp(this.calculateHits());
  }
}
