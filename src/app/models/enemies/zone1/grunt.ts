import { GameService } from 'src/app/game.service';
import { Enemy } from '../../enemy';

export class Grunt extends Enemy {

  name = 'Grunt';
  image = '/assets/images/enemies/zone1/grunt.png';
  baseHpMax = 4;
  baseHits = 3;
  baseXp = 3;
  baseAp = 1;
  baseGils = 4;
  weakness = ['ice'];
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
