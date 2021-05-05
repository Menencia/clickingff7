import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone1 extends Zone {

  ref = ZoneRef.Zone1;
  level = 1;
  image = '/assets/images/zones/Sector_1_Reactor.png';
  enemies = [
    EnemyLoader.build(EnemyRef.FirstRay, this.game),
    EnemyLoader.build(EnemyRef.MP, this.game),
    EnemyLoader.build(EnemyRef.Grunt, this.game),
    EnemyLoader.build(EnemyRef.Sweeper, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.GuardScorpion, this.game)
  ];

}
