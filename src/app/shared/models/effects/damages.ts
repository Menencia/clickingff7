import { BattleService } from '@shared/services/battle.service';
import { Action } from '@shared/models/action';

import { Effect } from '../effect';

export class DamagesEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action, battleService: BattleService): Promise<void> {
    battleService.getTarget(action.target).getAttacked(this.pwr, action);
  }
}
