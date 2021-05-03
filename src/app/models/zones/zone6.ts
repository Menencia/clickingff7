import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { Zone } from '../zone';

export class Zone6 extends Zone {

  level = 6;
  image = '/assets/images/zones/Shinra_headquarters.png';
  enemies = [
    EnemyLoader.build(EnemyRef.HeliGunner, this.game),
    EnemyLoader.build(EnemyRef.HundredGunner, this.game),
    EnemyLoader.build(EnemyRef.Rufus, this.game),
    EnemyLoader.build(EnemyRef.Zenene, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.MotorBall, this.game)
  ];

}
