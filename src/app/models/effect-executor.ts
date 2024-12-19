import { Action } from '../core/interfaces/action';
import { BattleService } from '../core/services/battle.service';

import { Effect } from './effect';

export const executeSkill = async (battleService: BattleService, effects: Effect[]): Promise<void> => {
  const action = new Action();
  effects.forEach(async (effect) => {
    await effect.executeEffect(action, battleService);
  });
};
