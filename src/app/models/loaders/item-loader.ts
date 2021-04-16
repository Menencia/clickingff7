import { GameService } from 'src/app/game.service';
import { Item } from '../item';
import { Potion } from '../items/potion';

export enum ItemRef {
  Potion = 'potion'
}

export class ItemLoader {

  /**
   * Build by reference
   */
    static build(ref: ItemRef, game: GameService): Item {
    let item;
    switch (ref) {
      case ItemRef.Potion:
        item = new Potion(game);
        break;
      default:
        throw new Error('Item not found');
    }
    return item;
  }

}
