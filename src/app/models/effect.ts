import { BattleService } from '../core/services/battle.service';

import { Action } from './action';

export abstract class Effect {
  abstract executeEffect(action: Action, battleService: BattleService): Promise<void>;
}
