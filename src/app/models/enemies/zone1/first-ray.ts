import { GameService } from 'src/app/game.service';
import { Enemy } from '../../enemy';

export class FirstRay extends Enemy {

  constructor(game: GameService) {
    super(game);

    this.name = '1st Ray';

    this.image = '/img/enemies/zone1/1st-ray.png';

    // BELOW – rate over 5
    this.baseHpMax = 2;
    this.baseHits = 1;
    this.baseXp = 1;
    this.baseAp = 1;
    this.baseGils = 5;
    // END

    this.weakness = ['bolt'];
  }

}
