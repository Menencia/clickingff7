import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone7 extends Zone {

  ref = ZoneRef.Zone7;
  level = 7;
  image = '/assets/images/zones/Kalm.png';
  enemies = [
    EnemyLoader.build(EnemyRef.KalmFang),
    EnemyLoader.build(EnemyRef.Mandragora),
    EnemyLoader.build(EnemyRef.Elfadunk),
    EnemyLoader.build(EnemyRef.Levrikon)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.MidgarZolom)
  ];

}
