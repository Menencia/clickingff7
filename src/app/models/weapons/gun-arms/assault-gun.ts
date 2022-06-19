import { WeaponRef } from '../../refs/weapons'
import { Weapon } from '../../weapon'

export class AssaultGun extends Weapon {

  ref = WeaponRef.AssaultGun
  name = 'Assault Gun'
  type = 'gun-arm'
  hits = 17
  price = 350
  maxMaterias = 1
  zoneAvailable = 2

}
