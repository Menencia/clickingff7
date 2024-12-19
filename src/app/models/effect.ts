import { Action } from '../core/interfaces/action';
import { BattleService } from '../core/services/battle.service';

export abstract class Effect {
  abstract executeEffect(action: Action, battleService: BattleService): Promise<void>;
}
