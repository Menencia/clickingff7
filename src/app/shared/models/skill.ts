import { ActionTarget } from '@shared/interfaces/action-target';
import { ActionType } from '@shared/interfaces/action-type';
import { Subject } from 'rxjs';
import { Effect } from './effect';

export class Skill {
  target = ActionTarget.OPPONENT;

  type = ActionType.PHYSIC;

  elements: string[] = [];

  completed = new Subject<boolean>();

  constructor(public effects: Effect[]) {}

  async execute(): Promise<void> {
    for (const effect of this.effects) {
      // todo handle frame
      await effect.execute();
    }
  }

  complete() {
    this.completed.next(true);
    this.completed.complete();
  }
}
