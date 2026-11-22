/**
 * Something the shop sells from a given zone and buys back at half price
 */
export abstract class Purchasable {
  price: number;

  /**
   * First zone (levelMax) from which the shop sells it
   */
  zoneAvailable: number;

  constructor(data: { price: number; zoneAvailable: number }) {
    this.price = data.price;
    this.zoneAvailable = data.zoneAvailable;
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

  /**
   * True once the player has unlocked the zone it is sold from
   */
  isAvailable(levelMax: number): boolean {
    return levelMax >= this.zoneAvailable;
  }
}
