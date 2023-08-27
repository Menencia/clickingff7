import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';
import { ActionSub } from '../action-sub';
import { Cure } from '../action-subs/cure';

export class Potion extends Item {

  ref = ItemRef.Potion;
  name = 'Potion';
  price = 60;

  available(): boolean {
    return true;
  }

  getActionSubs(battleService: BattleService): ActionSub[] {
    return [new Cure(Math.ceil(.33 * battleService.characters.hpMax))];
  }

}
