import { Item } from './item';
import { ItemSave } from './save';

export class Items {
  list: Item[];

  equipped: boolean;

  constructor() {
    this.list = [];
    this.equipped = false;
  }

  /**
   * Add an item
   */
  add(item: Item, equipped = false): void {
    const i = this.list.find((e) => e.data.ref === item.data.ref);
    if (i) {
      i.nbr += 1;
    } else {
      item.equipped = equipped;
      this.list.push(item);
    }
  }

  /**
   * Returns equipped items
   */
  getEquipped(): Item[] {
    return this.list.filter((e) => e.equipped);
  }

  /**
   * Get unequipped items
   */
  getUnequipped(): Item[] {
    return this.list.filter((e) => !e.equipped);
  }

  /**
   * Export all items
   */
  export(): ItemSave[] {
    const json: ItemSave[] = [];
    this.list.forEach((i) => {
      json.push(i.export());
    });
    return json;
  }
}
