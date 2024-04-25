import { ItAction } from '../core/interfaces/it-action';
import { BattleService } from '../core/services/battle.service';
import { ItemRef } from './refs/items';
import { ItemSave } from './save';

export const MAX_ITEMS = 2;

export abstract class Item {
  abstract ref: ItemRef;
  nbr: number;
  equipped: boolean;

  abstract name: string;
  abstract price: number;

  /**
   * Init
   */
  constructor() {
    // nbr owned
    this.nbr = 1;

    // equipped
    this.equipped = false;
  }

  /**
   * Extends
   */
  load(data: ItemSave): Item {
    this.ref = data.ref;
    this.nbr = data.nbr;
    this.equipped = data.equipped;
    return this;
  }

  abstract available(zoneLlevelMax: number): boolean;

  abstract canUse(battleService: BattleService): boolean;

  abstract getSkill(battleService: BattleService): ItAction[];

  use(battleService: BattleService) {
    const actions = this.getSkill(battleService);
    for (const action of actions) {
      action.use(battleService);
    }
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
    for (const i of items) {
      if (i.name === this.name) {
        sum += i.nbr;
      }
    }
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
