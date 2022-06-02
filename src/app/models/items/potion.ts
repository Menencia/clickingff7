import { BattleService } from 'src/app/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class Potion extends Item {

  ref = ItemRef.Potion;
  name = 'Potion';
  price = 60;

  available(): boolean {
    return true;
  }

  canUse(battleService: BattleService): boolean {
    return (battleService.characters.hp < battleService.characters.hpMax);
  }

  use(battleService: BattleService): void {
    const hp = Math.ceil(33 / 100 * battleService.characters.hpMax);
    battleService.characters.addHp(hp);
  }

}
