import { ItAction } from '../core/interfaces/it-action';
import { BattleService } from '../core/services/battle.service';

import { ItemRef } from './refs/items';
import { ItemSave } from './save';

export const MAX_ITEMS = 2;

export interface ItemJson {
  ref: ItemRef;
  effect: string;
  price: number;
  zoneAvailable: number;
}

export class Item {
  constructor(
    public readonly data: Readonly<ItemJson>,
    public nbr = 1,
    public equipped = false,
  ) {}

  available(zoneLlevelMax: number): boolean {
    return zoneLlevelMax >= this.data.zoneAvailable;
  }

  canUse(battleService: BattleService): boolean {
    if (this.data.effect.startsWith('increase hp')) {
      return battleService.team.hp < battleService.team.hpMax;
    }
    if (this.data.effect.startsWith('increase mp')) {
      return battleService.team.mp < battleService.team.mpMax;
    }
    throw new Error(`Skill ${this.data.effect} unknown`);
  }

  getSkill(battleService: BattleService): ItAction[] {
    if (this.data.effect.startsWith('increase hp')) {
      const [, , percent] = this.data.effect.split(' ');
      const action: ItAction = {
        use: () => {
          battleService.team.addHp(Math.ceil((+percent / 100) * battleService.team.hpMax));
        },
      };
      return [action];
    }
    if (this.data.effect.startsWith('increase mp')) {
      const [, , percent] = this.data.effect.split(' ');
      const action: ItAction = {
        use: () => {
          battleService.team.addMp(Math.ceil((+percent / 100) * battleService.team.mpMax));
        },
      };
      return [action];
    }
    throw new Error(`Skill ${this.data.effect} unknown`);
  }

  use(battleService: BattleService) {
    this.getSkill(battleService).forEach((action) => action.use(battleService));
  }

  /**
   * Returns the price of the item
   */
  getPrice(): number {
    return this.data.price;
  }

  /**
   * Returns the sell price of the item
   */
  getSellPrice(): number {
    return this.data.price / 2;
  }

  /**
   * Returns the number of owned
   */
  inStock(items: Item[]): number {
    let sum = 0;
    items.forEach((i) => {
      if (i.data.ref === this.data.ref) {
        sum += i.nbr;
      }
    });
    return sum;
  }

  /**
   * Save materia data
   */
  export(): ItemSave {
    const { nbr, equipped } = this;
    return { ref: this.data.ref, nbr, equipped };
  }
}
