import { Subject } from "rxjs";
import { BattleService } from "../core/services/battle.service";
import { ActionSub } from "./action-sub";

export abstract class Action {
  _complete = new Subject<boolean>();

  complete() {
    this._complete.next(true);
    this._complete.complete();
  }

  /**  */
  abstract use(battleService: BattleService): void;

  /** execute consecutive sub actions */
  protected doActionSubs(actionSubs: ActionSub[], battleService: BattleService): void {
    const actionSub = actionSubs.shift();
    actionSub?.use(battleService);
    actionSub?._complete.subscribe(() => {
      if (actionSubs.length > 0) {
        this.doActionSubs(actionSubs, battleService);
      } else {
        this.complete();
      }
    });
  }
}
