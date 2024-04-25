import { EnemyLoader } from '../loaders/enemy-loader';
import { EnemyRef } from '../refs/enemy';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone1 extends Zone {
  ref = ZoneRef.Zone1;

  level = 1;

  image = '/assets/images/zones/Sector_1_Reactor.png';

  enemies = [
    EnemyLoader.build(EnemyRef.FirstRay),
    EnemyLoader.build(EnemyRef.MP),
    EnemyLoader.build(EnemyRef.Grunt),
    EnemyLoader.build(EnemyRef.Sweeper),
  ];

  override boss = [EnemyLoader.build(EnemyRef.GuardScorpion)];
}
