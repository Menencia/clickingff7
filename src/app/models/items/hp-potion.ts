import { ItAction } from 'src/app/core/interfaces/it-action';
import { BattleService } from 'src/app/core/services/battle.service';

import { Item } from '../item';

export class HpPotion extends Item {
  canUse(battleService: BattleService): boolean {
    return battleService.team.hp < battleService.team.hpMax;
  }

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use: () => {
        battleService.team.addHp(Math.ceil(this.pwr * battleService.team.hpMax));
      },
    };
    return [action];
  }
}
