import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class Ether extends Item {

  ref = ItemRef.Ether;
  name = 'Ether';
  price = 70;

  available(): boolean {
    return true;
  }

  canUse(battleService: BattleService): boolean {
    return (battleService.characters.mp < battleService.characters.mpMax);
  }

  use(battleService: BattleService): void {
    const mp = Math.ceil(33 / 100 * battleService.characters.mpMax);
    battleService.characters.addMp(mp);
  }

}
