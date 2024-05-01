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

  ref: ItemRef;

  type: string;

  price: number;

  pwr: number;

  zoneAvailable: number;

  /**
   * Init
   */
  constructor(data: ItemJson) {
    this.ref = data.ref;
    this.type = data.type;
    this.price = data.price;
    this.pwr = data.pwr;
    this.zoneAvailable = data.zoneAvailable;
  }

  /**
   * Extends
   */
  load(data: ItemSave): Item {
    this.nbr = data.nbr;
    this.equipped = data.equipped;
    return this;
  }

  available(zoneLlevelMax: number): boolean {
    return zoneLlevelMax >= this.zoneAvailable;
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
    return this.price;
  }

  /**
   * Returns the sell price of the item
   */
  getSellPrice(): number {
    return this.price / 2;
  }

  /**
   * Returns the number of owned
   */
  inStock(items: Item[]): number {
    let sum = 0;
    items.forEach((i) => {
      if (i.ref === this.ref) {
        sum += i.nbr;
      }
    });
    return sum;
  }

  /**
   * Save materia data
   */
  export(): ItemSave {
    const { ref, nbr, equipped } = this;
    return { ref, nbr, equipped };
  }
}
