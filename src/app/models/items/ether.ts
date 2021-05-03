import { Item } from '../item';

export class Ether extends Item {

  name = 'Ether';
  price = 70;

  available(): boolean {
    return true;
  }

  canUse(): boolean {
    return (this.game.characters.mp < this.game.characters.mpMax);
  }

  action(): void {
    const mp = Math.ceil(33 / 100 * this.game.characters.mpMax);

    super.action(() => {
      this.game.characters.addMp(mp);
    });
  }

}
