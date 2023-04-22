import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class HiEther extends Item {

  ref = ItemRef.HiEther;
  name = 'Hi-Ether';
  price = 130;

  available(x: number): boolean {
    return x >= 7;
  }

  canUse(battleService: BattleService): boolean {
    return (battleService.characters.mp < battleService.characters.mpMax);
  }

  use(battleService: BattleService): void {
    const mp = Math.ceil(66 / 100 * battleService.characters.mpMax);
    battleService.characters.addMp(mp);
  }

}
