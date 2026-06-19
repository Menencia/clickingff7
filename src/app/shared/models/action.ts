import { ActionTarget } from '@shared/interfaces/action-target';
import { ActionType } from '@shared/interfaces/action-type';
import { Subject } from 'rxjs';

export class Action {
  target = ActionTarget.OPPONENT;

  type = ActionType.PHYSIC;

  elements: string[] = [];

  completed = new Subject<boolean>();

  complete() {
    this.completed.next(true);
    this.completed.complete();
  }
}
