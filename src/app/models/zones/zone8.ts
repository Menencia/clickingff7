import { EnemyLoader } from '../loaders/enemy-loader';
import { EnemyRef } from '../refs/enemy';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone8 extends Zone {
  ref = ZoneRef.Zone8;

  level = 8;

  image = '/assets/images/zones/Mythril_mine.png';

  enemies = [
    EnemyLoader.build(EnemyRef.Crawler),
    EnemyLoader.build(EnemyRef.Castanets),
    EnemyLoader.build(EnemyRef.Madouge),
    EnemyLoader.build(EnemyRef.ArkDragon),
  ];

  override boss = [EnemyLoader.build(EnemyRef.MysteryNinja)];
}
