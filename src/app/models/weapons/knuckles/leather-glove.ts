import { GameService } from 'src/app/game.service';
import { Weapon } from '../../weapon';

export class LeatherGlove extends Weapon {

  name = 'Leather Glove';
  type = 'knuckle';
  hits = 13;
  price = 120;
  maxMaterias = 1;
  zoneAvailable = 2;

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

}
