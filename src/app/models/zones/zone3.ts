import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader'
import { ZoneRef } from '../refs/zones'
import { Zone } from '../zone'

export class Zone3 extends Zone {

  ref = ZoneRef.Zone3
  level = 3
  image = '/assets/images/zones/Sector_6.png'
  enemies = [
    EnemyLoader.build(EnemyRef.Vice),
    EnemyLoader.build(EnemyRef.WholeEater),
    EnemyLoader.build(EnemyRef.HedgehogPie),
    EnemyLoader.build(EnemyRef.HellHouse)
  ]
  boss = [
    EnemyLoader.build(EnemyRef.Aps)
  ]

}
