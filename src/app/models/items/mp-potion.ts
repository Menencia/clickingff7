import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Item } from '../item';

export class MpPotion extends Item {
  canUse(battleService: BattleService): boolean {
    return battleService.team.mp < battleService.team.mpMax;
  }

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use: () => {
        battleService.team.addMp(
          Math.ceil(this.pwr * battleService.team.mpMax),
        );
      },
    };
    return [action];
  }
}
