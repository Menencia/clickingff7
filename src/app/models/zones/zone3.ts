import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone3 extends Zone {

  ref = ZoneRef.Zone3;
  level = 3;
  image = '/assets/images/zones/Sector_6.png';
  enemies = [
    EnemyLoader.build(EnemyRef.Vice, this.game),
    EnemyLoader.build(EnemyRef.WholeEater, this.game),
    EnemyLoader.build(EnemyRef.HedgehogPie, this.game),
    EnemyLoader.build(EnemyRef.HellHouse, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.Aps, this.game)
  ];

}
