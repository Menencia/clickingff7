import { Action } from './action';
import { Battle } from './battle';
import { Effect } from './effect';

export const executeSkill = async (
  battle: Battle,
  effects: Effect[],
): Promise<void> => {
  battle.actionOngoing = true;
  const action = new Action();
  effects.forEach(async (e) => {
    await e.executeEffect(action, battle);
  });
  return new Promise((resolve) => {
    action.completed.subscribe((completed) => {
      if (completed) {
        battle.actionOngoing = false;
        resolve();
      }
    });
  });
};
