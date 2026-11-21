import { Item, MAX_ITEMS } from './item';
import { ItemSave } from './save';

export class Items {
  list: Item[];

  /**
   * Init
   */
  constructor() {
    this.list = [];
  }

  /**
   * Add an item
   */
  add(item: Item, equipped = false): void {
    const i = this.list.find((e) => e.ref === item.ref);
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
   * Returns true if the item can be equipped (at most MAX_ITEMS)
   */
  canEquip(item: Item): boolean {
    return !item.equipped && this.getEquipped().length < MAX_ITEMS;
  }

  /**
   * Equips the item. Does nothing if MAX_ITEMS items are already equipped.
   */
  equip(item: Item): void {
    if (this.canEquip(item)) {
      item.equipped = true;
    }
  }

  /**
   * Unequips the item
   */
  unequip(item: Item): void {
    item.equipped = false;
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
