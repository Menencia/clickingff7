import { ItAction } from '../core/interfaces/it-action';
import { Context } from './context';
import { Purchasable } from './purchasable';

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

export abstract class Item extends Purchasable {
  nbr = 1;

  equipped = false;

  ref: ItemRef;

  type: string;

  pwr: number;

  zoneAvailable: number;

  /**
   * Init
   */
  constructor(data: ItemJson) {
    super(data.price);
    this.ref = data.ref;
    this.type = data.type;
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

  available(zoneLevelMax: number): boolean {
    return zoneLevelMax >= this.zoneAvailable;
  }

  abstract canUse(context: Context): boolean;

  abstract getSkill(context: Context): ItAction[];

  use(context: Context) {
    this.getSkill(context).map((action) => action.use(context));
  }

  /**
   * Save item data
   */
  export(): ItemSave {
    const { ref, nbr, equipped } = this;
    return { ref, nbr, equipped };
  }
}
