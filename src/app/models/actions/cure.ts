import { ItAction } from '../../core/interfaces/it-action';
import { withVariance } from '../../shared/utils/game.utils';
import { Context } from '../context';

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
