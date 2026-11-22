import { Item, MAX_ITEMS } from './item';
import { ItemSave } from './save';
import { Stock } from './stock';

export class Items extends Stock<Item> {
  /**
   * Adds an item. {equipped} only applies to an item not owned yet.
   */
  override add(item: Item, equipped = false): Item {
    const owned = super.add(item);
    if (owned === item) {
      item.equipped = equipped;
    }
    return owned;
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
   * Unequips the last equipped items until at most MAX_ITEMS remain
   */
  fit(): void {
    this.getEquipped()
      .slice(MAX_ITEMS)
      .forEach((i) => {
        i.equipped = false;
      });
  }

  /**
   * Export all items
   */
  export(): ItemSave[] {
    return this.list.map((i) => i.export());
  }
}
