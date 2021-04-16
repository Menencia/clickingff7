import { GameService } from 'src/app/game.service';
import { CureMateria } from '../cure-materia';

export class Restore extends CureMateria {

  name = 'Restore';
  color = 'green';
  price = 400;
  apBase = 2;
  pwr = 20;
  zoneAvailable = 7;

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

}
