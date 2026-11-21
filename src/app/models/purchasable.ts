/**
 * Something the shop sells and buys back at half price
 */
export abstract class Purchasable {
  price: number;

  constructor(price: number) {
    this.price = price;
  }

  /**
   * Returns the buying price
   */
  getPrice(): number {
    return this.price;
  }

  /**
   * Returns the selling price (half the buying price)
   */
  getSellPrice(): number {
    return this.price / 2;
  }
}
