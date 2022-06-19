import { WeaponRef } from '../../refs/weapons'
import { Weapon } from '../../weapon'

export class LeatherGlove extends Weapon {

  ref = WeaponRef.LeatherGlove
  name = 'Leather Glove'
  type = 'knuckle'
  hits = 13
  price = 120
  maxMaterias = 1
  zoneAvailable = 2

}
