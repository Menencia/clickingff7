import { BattleService } from 'src/app/core/services/battle.service';
import { Item } from '../item';
import { ItemRef } from '../refs/items';
import { ItAction } from 'src/app/core/interfaces/it-action';

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

  getSkill(battleService: BattleService): ItAction[] {
    const action: ItAction = {
      use() {
        battleService.characters.addHp(Math.ceil(.33 * battleService.characters.hpMax), this);
      }
    };
    return [action];
  }

}
