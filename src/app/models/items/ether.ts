import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';
import { ActionSub } from '../action-sub';
import { CureMP } from '../action-subs/cure-mp';

export class Ether extends Item {

  ref = ItemRef.Ether;
  name = 'Ether';
  price = 70;

  available(): boolean {
    return true;
  }

  getActionSubs(battleService: BattleService): ActionSub[] {
    return [new CureMP(Math.ceil(.33 * battleService.characters.mpMax))];
  }
}
