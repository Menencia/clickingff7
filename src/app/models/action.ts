import { BehaviorSubject } from 'rxjs';
import { Units } from 'src/app/models/units';
import { ActionType } from 'src/app/shared/interfaces/action-type';

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
