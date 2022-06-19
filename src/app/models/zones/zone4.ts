import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader'
import { ZoneRef } from '../refs/zones'
import { Zone } from '../zone'

export class Zone4 extends Zone {

  ref = ZoneRef.Zone4
  level = 4
  image = '/assets/images/zones/Sector_7.png'
  enemies = [
    EnemyLoader.build(EnemyRef.AeroCombatant),
    EnemyLoader.build(EnemyRef.Deenglow),
    EnemyLoader.build(EnemyRef.Eligor),
    EnemyLoader.build(EnemyRef.GuardHound)
  ]
  boss = [
    EnemyLoader.build(EnemyRef.Reno)
  ]

}
