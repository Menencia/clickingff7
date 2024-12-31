import { Action } from '@shared/models/action';

import { Battle } from '../battle';
import { Effect } from '../effect';

export class DamagesEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action, battle: Battle): Promise<void> {
    battle.getTarget(action.target).getAttacked(this.pwr, action);
  }
}
