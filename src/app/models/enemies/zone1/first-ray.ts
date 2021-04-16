import { GameService } from 'src/app/game.service';
import { Enemy } from '../../enemy';

export class FirstRay extends Enemy {

  name = '1st Ray';
  image = '/assets/images/enemies/zone1/1st-ray.png';
  baseHpMax = 2;
  baseHits = 1;
  baseXp = 1;
  baseAp = 1;
  baseGils = 5;
  weakness = ['bolt'];
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
