import { random } from '../utils';

export class Cure {

  /**
   * Init
   */
  constructor(public pwr: number) {}

  /**
   * Get *random* cure from power
   */
  getCure(): number {
    // base cure
    const a = this.pwr * (1 - 10 / 100);
    const b = this.pwr * (1 + 10 / 100);

    return Math.round(random(a, b));
  }

}
