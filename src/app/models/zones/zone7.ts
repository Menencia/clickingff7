import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone7 extends Zone {

  ref = ZoneRef.Zone7;
  level = 7;
  image = '/assets/images/zones/Kalm.png';
  enemies = [
    EnemyLoader.build(EnemyRef.KalmFang, this.game),
    EnemyLoader.build(EnemyRef.Mandragora, this.game),
    EnemyLoader.build(EnemyRef.Elfadunk, this.game),
    EnemyLoader.build(EnemyRef.Levrikon, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.MidgarZolom, this.game)
  ];

}
