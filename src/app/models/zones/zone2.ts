import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { Zone } from '../zone';

export class Zone2 extends Zone {

  level = 2;
  image = '/assets/images/zones/Sector_5_Reactor.png';
  enemies = [
    EnemyLoader.build(EnemyRef.BloodTaste, this.game),
    EnemyLoader.build(EnemyRef.ProtoMachinegun, this.game),
    EnemyLoader.build(EnemyRef.Smogger, this.game),
    EnemyLoader.build(EnemyRef.SpecialCombatant, this.game)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.AirBuster, this.game)
  ];

}
