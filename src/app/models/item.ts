import { ItAction } from '../core/interfaces/it-action';
import { BattleService } from '../core/services/battle.service';

import { ItemRef } from './refs/items';
import { ItemSave } from './save';

export const MAX_ITEMS = 2;

export interface ItemJson {
  ref: ItemRef;
  type: string;
  price: number;
  pwr: number;
  zoneAvailable: number;
}

export abstract class Item {
  nbr = 1;

  equipped = false;

  constructor(public readonly data: Readonly<ItemJson>) {}

  load(data: ItemSave) {
    this.nbr = data.nbr;
    this.equipped = data.equipped;
  }

  available(zoneLlevelMax: number): boolean {
    return zoneLlevelMax >= this.data.zoneAvailable;
  }

  abstract canUse(battleService: BattleService): boolean;

  abstract getSkill(battleService: BattleService): ItAction[];

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
