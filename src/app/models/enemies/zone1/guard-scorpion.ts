import { GameService } from 'src/app/game.service';
import { Enemy } from '../../enemy';

export class GuardScorpion extends Enemy {

  constructor(game: GameService) {
    super(game);

    this.name = 'Guard Scorpion';

    this.image = '/img/enemies/zone1/guard-scorpion.png';

    this.boss = true;

    // BELOW – rate over 5
    this.baseHpMax = 4;
    this.baseHits = 3;
    this.baseXp = 3;
    this.baseAp = 3;
    this.baseGils = 3;
    // END

    this.weakness = ['bolt'];
  }

}
