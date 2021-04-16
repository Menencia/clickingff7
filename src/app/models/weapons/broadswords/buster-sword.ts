import { GameService } from 'src/app/game.service';
import { Weapon } from '../../weapon';

export class BusterSword extends Weapon {

  name = 'Buster Sword';
  type = 'broadsword';
  hits = 18;
  price = 170;
  maxMaterias = 1;
  zoneAvailable = 1;

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

}
