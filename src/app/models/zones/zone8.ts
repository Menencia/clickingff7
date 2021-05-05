import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone8 extends Zone {

  ref = ZoneRef.Zone8;
  level = 8;
  image = '/assets/images/zones/Mythril_mine.png';
  enemies = [
    EnemyLoader.build(EnemyRef.Crawler, this.game),
    EnemyLoader.build(EnemyRef.Castanets, this.game),
    EnemyLoader.build(EnemyRef.Madouge, this.game),
    EnemyLoader.build(EnemyRef.ArkDragon, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.MysteryNinja, this.game)
  ];

}
