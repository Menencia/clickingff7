import { EnemyLoader, EnemyRef } from '../loaders/enemy-loader'
import { ZoneRef } from '../refs/zones'
import { Zone } from '../zone'

export class Zone9 extends Zone {

  ref = ZoneRef.Zone9
  level = 9
  image = '/assets/images/zones/Junon.jpg'
  enemies = [
    EnemyLoader.build(EnemyRef.Capparwire),
    EnemyLoader.build(EnemyRef.Formula),
    EnemyLoader.build(EnemyRef.Zemzelett),
    EnemyLoader.build(EnemyRef.HellRider)
  ]
  boss = [
    EnemyLoader.build(EnemyRef.Bottomswell)
  ]

}
