import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone6 extends Zone {

  ref = ZoneRef.Zone6;
  level = 6;
  image = '/assets/images/zones/Shinra_headquarters.png';
  enemies = [
    EnemyLoader.build(EnemyRef.HeliGunner),
    EnemyLoader.build(EnemyRef.HundredGunner),
    EnemyLoader.build(EnemyRef.Rufus),
    EnemyLoader.build(EnemyRef.Zenene)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.MotorBall)
  ];

}
