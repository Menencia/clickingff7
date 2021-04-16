import { GameService } from 'src/app/game.service';
import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { Zone } from '../zone';

export class Zone1 extends Zone {

  level = 1;
  image = '/assets/images/zones/Sector_1_Reactor.png';
  enemies = [
    EnemyLoader.build(EnemyRef.FirstRay, this.game),
    // 'MP',
    // 'Grunt',
    // 'Sweeper'
  ];
  boss = [
    EnemyLoader.build(EnemyRef.GuardScorpion, this.game)
  ];

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

}
