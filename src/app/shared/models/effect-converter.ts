import { ActionTarget } from '@shared/interfaces/action-target';
import { ActionType } from '@shared/interfaces/action-type';

import { Effect } from './effect';
import { DamagesEffect } from './effects/damages';
import { ElementEffect } from './effects/element';
import { HealEffect } from './effects/heals';
import { TargetEffect } from './effects/target';
import { TypeEffect } from './effects/type';

export const convertEffects = (effects: string[]): Effect[] => {
  return effects
    .map((effect) => effect.trim())
    .map((effect) => {
      if (effect.startsWith('target')) {
        const [, target] = effect.split(' ');
        return new TargetEffect(target as ActionTarget);
      }
      if (effect.startsWith('heal')) {
        const [, pwr] = effect.split(' ');
        return new HealEffect(+pwr);
      }
      if (effect.startsWith('element')) {
        const [, element] = effect.split(' ');
        return new ElementEffect(element);
      }
      if (effect.startsWith('type')) {
        const [, type] = effect.split(' ');
        return new TypeEffect(type as ActionType);
      }
      if (effect.startsWith('damages')) {
        const [, damages] = effect.split(' ');
        return new DamagesEffect(+damages);
      }
      throw new Error(`Unknown effect: ${effect}`);
    });
};
