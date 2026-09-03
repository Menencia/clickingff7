import { ItAction } from '../../core/interfaces/it-action';
import { Battle } from '../battle';
import { Item } from '../item';

export class MpPotion extends Item {
  canUse(battle: Battle): boolean {
    return battle.characters.mp < battle.characters.mpMax;
  }

  getSkill(battle: Battle): ItAction[] {
    const action: ItAction = {
      use: () => {
        battle.characters.addMp(Math.ceil(this.pwr * battle.characters.mpMax));
      },
    };
    return [action];
  }
}
