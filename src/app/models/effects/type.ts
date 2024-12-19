import { Action } from 'src/app/core/interfaces/action';
import { ActionType } from 'src/app/shared/interfaces/action-type';

import { Effect } from '../effect';

export class TypeEffect implements Effect {
  constructor(private type: ActionType) {}

  async executeEffect(action: Action): Promise<void> {
    action.type = this.type;
  }
}
