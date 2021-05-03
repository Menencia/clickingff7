import { GameService } from 'src/app/game.service';
import { Item } from '../item';
import { Ether } from '../items/ether';
import { Potion } from '../items/potion';

export enum ItemRef {
  Ether = 'Ether',
  Potion = 'Potion',
}

export class ItemLoader {

  /**
   * Build by reference
   */
    static build(ref: ItemRef, game: GameService): Item {
    let item;
    switch (ref) {
      case ItemRef.Ether:
        item = new Ether(game);
        break;
      case ItemRef.Potion:
        item = new Potion(game);
        break;
      default:
        throw new Error('Item not found: ' + ref);
    }
    return item;
  }

}
