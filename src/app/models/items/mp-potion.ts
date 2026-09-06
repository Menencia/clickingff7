import { ItAction } from '../../core/interfaces/it-action';
import { Context } from '../context';
import { Item } from '../item';

export class MpPotion extends Item {
  canUse(context: Context): boolean {
    return context.characters.mp < context.characters.mpMax;
  }

  getSkill(context: Context): ItAction[] {
    const action: ItAction = {
      use: () => {
        context.characters.addMp(
          Math.ceil(this.pwr * context.characters.mpMax),
        );
      },
    };
    return [action];
  }
}
