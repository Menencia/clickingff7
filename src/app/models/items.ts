import { Item } from './item';
import { ItemSave } from './save';

export class Items {

  list: Item[];
  equipped: boolean;

  /**
   * Init
   */
  constructor() {
    this.list = [];
    this.equipped = false;
  }

  /**
   * Add an item
   */
  add(item: Item, equipped = false): void {
    const i = this.list.find(e => e.name === item.name);
    if (i) {
      i.nbr++;
    } else {
      item.equipped = equipped;
      this.list.push(item);
    }
  }

  /**
   * Returns equipped items
   */
  getEquipped(): Item[] {
    return this.list.filter(e => e.equipped);
  }

  /**
   * Get unequipped items
   */
  getUnequipped(): Item[] {
    return this.list.filter(e => !e.equipped);
  }

  /**
   * Export all items
   */
  export(): ItemSave[] {
    const json = [];
    for (const i of this.list) {
      json.push(i.export());
    }
    return json;
  }

}
