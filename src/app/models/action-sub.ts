import { Subject } from "rxjs";
import { BattleService } from "../core/services/battle.service";

export abstract class ActionSub {
  _complete = new Subject<boolean>();

  complete() {
    this._complete.next(true);
    this._complete.complete();
  }

  abstract use(battleService: BattleService): void
}
