import { ActionTarget } from '@shared/interfaces/action-target';
import { ActionType } from '@shared/interfaces/action-type';
import { BehaviorSubject } from 'rxjs';

export class Action {
  target = ActionTarget.OPPONENT;

  type = ActionType.PHYSIC;

  elements: string[] = [];

  completed = new BehaviorSubject(false);

  complete() {
    this.completed.next(true);
    this.completed.complete();
  }
}
