import { BattleService } from 'src/app/core/services/battle.service';
import { Action } from 'src/app/models/action';

import { Effect } from '../effect';

export class HealEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action, battleService: BattleService): Promise<void> {
    battleService.getTarget(action.target).addHp(this.pwr, action);
  }
}
