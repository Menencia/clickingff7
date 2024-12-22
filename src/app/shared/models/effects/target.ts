import { Action } from '@shared/models/action';
import { ActionTarget } from 'src/app/shared/interfaces/action-target';

import { Effect } from '../effect';

export class TargetEffect implements Effect {
  constructor(private target: ActionTarget) {}

  async executeEffect(action: Action): Promise<void> {
    action.target = this.target;
  }
}
