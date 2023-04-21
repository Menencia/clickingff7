import { BattleService } from 'src/app/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class HiPotion extends Item {

  ref = ItemRef.HiPotion;
  name = 'Hi-Potion';
  price = 100;

  available(x: number): boolean {
    return x >= 7;
  }

  canUse(battleService: BattleService): boolean {
    return (battleService.characters.hp < battleService.characters.hpMax);
  }

  use(battleService: BattleService): void {
    const hp = Math.ceil(66 / 100 * battleService.characters.hpMax);
    battleService.characters.addHp(hp);
  }

}
