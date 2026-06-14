import { ActionTarget } from '@shared/interfaces/action-target';
import { Action } from '@shared/models/action';

import { Effect } from '../effect';

export class TargetEffect implements Effect {
  constructor(private target: ActionTarget) {}

  async executeEffect(action: Action): Promise<void> {
    action.target = this.target;
  }
}
