import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone5 extends Zone {
  ref = ZoneRef.Zone5;
  level = 5;
  image = '/assets/images/zones/Shinra_headquarters.png';
  enemies = [
    EnemyLoader.build(EnemyRef.MightyGrunt),
    EnemyLoader.build(EnemyRef.Soldier3rd),
    EnemyLoader.build(EnemyRef.SwordDance),
    EnemyLoader.build(EnemyRef.VargidPolice),
  ];
  override boss = [EnemyLoader.build(EnemyRef.SampleH0512)];
}
