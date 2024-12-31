import { Action } from './action';
import { Battle } from './battle';

export abstract class Effect {
  abstract executeEffect(action: Action, battle: Battle): Promise<void>;
}
