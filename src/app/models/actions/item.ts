import { BattleService } from '../../core/services/battle.service';
import { Item } from '../item';
import { Action } from '../action';
import { CureMP } from '../action-subs/cure-mp';
import { Cure } from '../action-subs/cure';

type AllCure = Cure | CureMP;

export class ItemAction extends Action {

  public critical = false;

  constructor(public item: Item) {
    super();
  }

  /** Can use the materia? */
  canUse(battleService: BattleService): boolean {
    return (battleService.characters.hp < battleService.characters.hpMax);
  }

  /** Use all sub actions */
  use(battleService: BattleService): void {
    const actionSubs = this.item.getActionSubs(battleService);
    this.doActionSubs(actionSubs, battleService);
  }
}
