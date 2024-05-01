import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Item } from '../item';

export class MpPotion extends Item {
  canUse(battleService: BattleService): boolean {
    return battleService.characters.mp < battleService.characters.mpMax;
  }

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use: () => {
        battleService.characters.addMp(
          Math.ceil(this.pwr * battleService.characters.mpMax),
        );
      },
    };
    return [action];
  }
}
