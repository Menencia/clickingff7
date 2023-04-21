import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader';
import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';

export class Zone2 extends Zone {

  ref = ZoneRef.Zone2;
  level = 2;
  image = '/assets/images/zones/Sector_5_Reactor.png';
  enemies = [
    EnemyLoader.build(EnemyRef.BloodTaste),
    EnemyLoader.build(EnemyRef.ProtoMachinegun),
    EnemyLoader.build(EnemyRef.Smogger),
    EnemyLoader.build(EnemyRef.SpecialCombatant)
  ];
  boss = [
    EnemyLoader.build(EnemyRef.AirBuster)
  ];

}
