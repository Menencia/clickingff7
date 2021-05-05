import { GameService } from 'src/app/game.service';
import { Item } from '../item';
import { Ether } from '../items/ether';
import { HiEther } from '../items/hi-ether';
import { HiPotion } from '../items/hi-potion';
import { Potion } from '../items/potion';
import { ItemRef } from '../refs/items';

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
      case ItemRef.HiEther:
        item = new HiEther(game);
        break;
      case ItemRef.HiPotion:
        item = new HiPotion(game);
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
