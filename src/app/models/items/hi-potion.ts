import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

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
    return battleService.characters.hp < battleService.characters.hpMax;
  }

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use() {
        battleService.characters.addHp(
          Math.ceil(0.66 * battleService.characters.hpMax),
        );
      },
    };
    return [action];
  }
}
