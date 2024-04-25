import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class FPtShuriken extends Weapon {
  ref = WeaponRef.FPtShuriken;
  name = '4-point Shuriken';
  type = 'shuriken';
  hits = 23;
  price = 180;
  maxMaterias = 2;
  zoneAvailable = 9;
}
