import { ItAction } from '../../core/interfaces/it-action';
import { Context } from '../context';
import { Item } from '../item';

export class HpPotion extends Item {
  canUse(context: Context): boolean {
    return context.characters.hp() < context.characters.hpMax;
  }

  getSkill(context: Context): ItAction[] {
    const action: ItAction = {
      use: () => {
        context.characters.addHp(
          Math.ceil(this.pwr * context.characters.hpMax),
        );
      },
    };
    return [action];
  }
}
