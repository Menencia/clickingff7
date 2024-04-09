import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';
import { ItAction } from 'src/app/core/interfaces/it-action';

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

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use() {
        battleService.characters.addMp(Math.ceil(.66 * battleService.characters.mpMax));
      }
    };
    return [action];
  }

}
