import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class HiEther extends Item {

  ref = ItemRef.HiEther;
  name = 'Hi-Ether';
  price = 130;

  available(x: number): boolean {
    return x >= 7;
  }

  canUse(): boolean {
    return (this.game.characters.mp < this.game.characters.mpMax);
  }

  action(): void {
    const mp = Math.ceil(66 / 100 * this.game.characters.mpMax);

    super.action(() => {
      this.game.characters.addMp(mp);
    });
  }

}
