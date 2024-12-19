import { Action } from 'src/app/core/interfaces/action';

import { Effect } from '../effect';

export class ElementEffect implements Effect {
  constructor(private elements: string) {}

  async executeEffect(action: Action): Promise<void> {
    action.elements = [this.elements];
  }
}
