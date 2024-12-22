import { Action } from 'src/app/models/action';

import { Effect } from '../effect';

export class HealEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action): Promise<void> {
    action.target.addHp(this.pwr, action);
  }
}
