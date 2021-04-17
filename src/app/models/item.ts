import { GameService } from '../game.service';
import { ItemRef } from './loaders/item-loader';
import { ItemSave } from './save';

export const MAX_ITEMS = 2;

export abstract class Item {

  ref: ItemRef;
  nbr: number;
  equipped: boolean;

  abstract name: string;
  abstract price: number;

  /**
   * Constructor
   */
  constructor(public game: GameService) {
    this.ref = this.constructor.name as ItemRef;

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

  /**
   *
   */
  abstract available(zoneLlevelMax: number): boolean;

  /**
   *
   */
  abstract canUse(): boolean;

  /**
   * Executes materia action
   */
  action(fn = () => {}): void {
    // cost
    if (this.canUse()) {
      this.remove();
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    fn();
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
   * Returns true if the item can be bought
   */
  canBuy(): boolean {
    return (this.game.gils >= this.getPrice());
  }

  /**
   * Buy the item
   */
  buy(): void {
    if (this.canBuy()) {
      this.game.gils -= this.getPrice();
      const equipped = (this.game.items.getEquipped().length < MAX_ITEMS);
      this.game.items.add(this, equipped);
    }
  }

  /**
   * Returns true if the item can be sold
   */
  canSell(): boolean {
    return true;
  }

  /**
   * Sell the weapon
   */
  sell(): void {
    if (this.canSell()) {
      this.game.gils += this.getSellPrice();
      this.remove();
    }
  }

  /**
   * Returns the number of owned
   */
  inStock(): number {
    let sum = 0;
    for (const i of this.game.items.list) {
      if (i.name === this.name) {
        sum += i.nbr;
      }
    }
    return sum;
  }

  /**
   * Returns true if the materia can be equipped
   */
  canEquip(): boolean {
    return (this.game.items.getEquipped().length < MAX_ITEMS);
  }

  /**
   * Equip the item
   */
  equip(): void {
    this.equipped = true;
  }

  /**
   * Unequip the item
   */
  unequip(): void {
    this.equipped = false;
  }

  /**
   * Remove one ex. of the item
   */
  remove(): void {
    if (this.nbr > 1) {
      this.nbr--;
    } else {
      this.game.items.list = this.game.items.list.filter(e => e !== this);
    }
  }

  /**
   * Save materia data
   */
  export(): ItemSave {
    const {ref, nbr, equipped} = this;
    return {ref, nbr, equipped};
  }

}
