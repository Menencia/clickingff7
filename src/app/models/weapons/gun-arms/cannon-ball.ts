import { WeaponRef } from '../../refs/weapons'
import { Weapon } from '../../weapon'

export class CannonBall extends Weapon {

  ref = WeaponRef.CannonBall
  name = 'Cannon Ball'
  type = 'gun-arm'
  hits = 23
  price = 900
  maxMaterias = 1
  zoneAvailable = 7

}
