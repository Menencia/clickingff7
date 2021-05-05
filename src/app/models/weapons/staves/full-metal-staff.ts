import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class FullMetalStaff extends Weapon {

  ref = WeaponRef.FullMetalStaff;
  name = 'Full Metal Staff';
  type = 'stave';
  hits = 22;
  price = 850;
  maxMaterias = 2;
  zoneAvailable = 7;

}
