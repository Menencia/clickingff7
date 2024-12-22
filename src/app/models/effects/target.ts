import { BattleService } from 'src/app/core/services/battle.service';
import { Action } from 'src/app/models/action';

import { Effect } from '../effect';

export class TargetEffect implements Effect {
  constructor(private target: 'self' | 'opponent') {}

  async executeEffect(action: Action, battleService: BattleService): Promise<void> {
    switch (this.target) {
      case 'self':
        action.target = battleService.getPlayer();
        break;
      case 'opponent':
        action.target = battleService.getOpponent();
        break;
      default:
        throw new Error(`Target unknown: ${this.target}`);
    }
  }
}
