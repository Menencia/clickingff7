import { GameService } from 'src/app/game.service';
import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { Zone } from '../zone';

export class Zone1 extends Zone {

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);

    this.level = 1;

    this.image = '/img/zones/Sector_1_Reactor.png';

    this.enemies = [
      EnemyLoader.build(EnemyRef.FirstRay, game),
      // 'MP',
      // 'Grunt',
      // 'Sweeper'
    ];

    this.boss = [
      EnemyLoader.build(EnemyRef.GuardScorpion, game)
    ];
  }

}
