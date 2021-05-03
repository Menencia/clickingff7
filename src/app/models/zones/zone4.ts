import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { Zone } from '../zone';

export class Zone4 extends Zone {

  level = 4;
  image = '/assets/images/zones/Sector_7.png';
  enemies = [
    EnemyLoader.build(EnemyRef.AeroCombatant, this.game),
    EnemyLoader.build(EnemyRef.Deenglow, this.game),
    EnemyLoader.build(EnemyRef.Eligor, this.game),
    EnemyLoader.build(EnemyRef.GuardHound, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.Reno, this.game)
  ];

}
