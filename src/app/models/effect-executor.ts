import { BattleService } from '../core/services/battle.service';

import { Action } from './action';
import { Effect } from './effect';

export const executeSkill = async (battleService: BattleService, effects: Effect[]): Promise<void> => {
  battleService.actionOngoing = true;
  const action = new Action();
  effects.forEach(async (e) => {
    await e.executeEffect(action, battleService);
  });
  return new Promise((resolve) => {
    action.completed.subscribe((completed) => {
      if (completed) {
        battleService.actionOngoing = false;
        resolve();
      }
    });
  });
};
