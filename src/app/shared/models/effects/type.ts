import { ActionType } from '@shared/interfaces/action-type';
import { Action } from '@shared/models/action';

import { Effect } from '../effect';

export class TypeEffect implements Effect {
  constructor(private type: ActionType) {}

  async executeEffect(action: Action): Promise<void> {
    action.type = this.type;
  }
}
