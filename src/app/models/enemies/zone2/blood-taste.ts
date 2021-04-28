import { GameService } from 'src/app/game.service';
import { Enemy } from '../../enemy';

export class BloodTaste extends Enemy {

  name = 'Blood Taste';
  image = '/assets/images/enemies/zone2/blood-taste.png';
  baseHpMax = 2;
  baseHits = 3;
  baseXp = 3;
  baseAp = 1;
  baseGils = 4;
  weakness = ['fire'];
  resistance = [];
  boss = false;
  miboss = false;

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

}
