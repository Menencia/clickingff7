import { Item } from '../item';
import { ItemRef } from '../refs/items';

export class Potion extends Item {

  ref = ItemRef.Potion;
  name = 'Potion';
  price = 60;

  available(): boolean {
    return true;
  }

  canUse(): boolean {
    return (this.game.characters.hp < this.game.characters.hpMax);
  }

  action(): void {
    const hp = Math.ceil(33 / 100 * this.game.characters.hpMax);

    super.action(() => {
      this.game.characters.addHp(hp);
    });
  }

}
