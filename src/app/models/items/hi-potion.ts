import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';
import { ActionSub } from '../action-sub';
import { Cure } from '../action-subs/cure';

export class HiPotion extends Item {

  ref = ItemRef.HiPotion;
  name = 'Hi-Potion';
  price = 100;

  available(x: number): boolean {
    return x >= 7;
  }

  getActionSubs(battleService: BattleService): ActionSub[] {
    return [new Cure(Math.ceil(.66 * battleService.characters.hpMax))];
  }
}
