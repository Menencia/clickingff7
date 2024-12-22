import { BehaviorSubject } from 'rxjs';
import { ActionType } from 'src/app/shared/interfaces/action-type';

import { Units } from './units';

export class Action {
  elements: string[] = [];

  type = ActionType.PHYSIC;

  completed = new BehaviorSubject(false);

  constructor(public target: Units) {}

  complete() {
    this.completed.next(true);
    this.completed.complete();
  }
}
