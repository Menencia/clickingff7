import { Action } from 'src/app/core/interfaces/action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Effect } from '../effect';

export class HealEffect implements Effect {
  constructor(private pwr: number) {}

  async executeEffect(action: Action, battleService: BattleService): Promise<void> {
    battleService.team.addHp(this.pwr);
  }
}
