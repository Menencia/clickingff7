import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone9 extends Zone {

  ref = ZoneRef.Zone9;
  level = 9;
  image = '/assets/images/zones/Junon.jpg';
  enemies = [
    EnemyLoader.build(EnemyRef.Capparwire, this.game),
    EnemyLoader.build(EnemyRef.Formula, this.game),
    EnemyLoader.build(EnemyRef.Zemzelett, this.game),
    EnemyLoader.build(EnemyRef.HellRider, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.Bottomswell, this.game)
  ];

}
