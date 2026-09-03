import { ItAction } from '../../core/interfaces/it-action';
import { Battle } from '../battle';
import { Item } from '../item';

export class HpPotion extends Item {
  canUse(battle: Battle): boolean {
    return battle.characters.hp() < battle.characters.hpMax;
  }

  getSkill(battle: Battle): ItAction[] {
    const action: ItAction = {
      use: () => {
        battle.characters.addHp(Math.ceil(this.pwr * battle.characters.hpMax));
      },
    };
    return [action];
  }
}
