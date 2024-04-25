import { ItAction } from 'src/app/core/interfaces/it-action';
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
    return battleService.characters.mp < battleService.characters.mpMax;
  }

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use() {
        battleService.characters.addMp(
          Math.ceil(0.33 * battleService.characters.mpMax),
        );
      },
    };
    return [action];
  }
}
