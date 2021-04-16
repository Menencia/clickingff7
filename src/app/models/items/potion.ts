import { GameService } from 'src/app/game.service';
import { Item } from '../item';

export class Potion extends Item {

  name = 'Potion';
  price = 60;

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

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
