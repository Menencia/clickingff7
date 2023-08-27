import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';
import { ActionSub } from '../action-sub';
import { CureMP } from '../action-subs/cure-mp';

export class HiEther extends Item {

  ref = ItemRef.HiEther;
  name = 'Hi-Ether';
  price = 130;

  available(x: number): boolean {
    return x >= 7;
  }

  getActionSubs(battleService: BattleService): ActionSub[] {
    return [new CureMP(Math.ceil(.66 * battleService.characters.mpMax))];
  }
}
