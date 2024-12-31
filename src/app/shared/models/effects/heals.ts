import { Action } from '@shared/models/action';

import { Battle } from '../battle';
import { Effect } from '../effect';

export class HealEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action, battle: Battle): Promise<void> {
    battle.getTarget(action.target).addHp(this.pwr, action);
  }
}
