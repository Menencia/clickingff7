import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class HiPotion extends Item {

  ref = ItemRef.HiPotion;
  name = 'Hi-Potion';
  price = 100;

  available(x: number): boolean {
    return x >= 7;
  }

  canUse(): boolean {
    return (this.game.characters.hp < this.game.characters.hpMax);
  }

  action(): void {
    const hp = Math.ceil(66 / 100 * this.game.characters.hpMax);

    super.action(() => {
      this.game.characters.addHp(hp);
    });
  }

}
