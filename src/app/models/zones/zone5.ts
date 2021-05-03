import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { Zone } from '../zone';

export class Zone5 extends Zone {

  level = 5;
  image = '/assets/images/zones/Shinra_headquarters.png';
  enemies = [
    EnemyLoader.build(EnemyRef.MightyGrunt, this.game),
    EnemyLoader.build(EnemyRef.Soldier3rd, this.game),
    EnemyLoader.build(EnemyRef.SwordDance, this.game),
    EnemyLoader.build(EnemyRef.VargidPolice, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.SampleH0512, this.game)
  ];

}
