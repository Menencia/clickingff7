import { Action } from '@shared/models/action';
import { BattleService } from '@shared/services/battle.service';

import { Effect } from '../effect';

export class HealEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action, battleService: BattleService): Promise<void> {
    battleService.getTarget(action.target).addHp(this.pwr, action);
  }
}
