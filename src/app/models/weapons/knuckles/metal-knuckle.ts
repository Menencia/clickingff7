import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class MetalKnuckle extends Weapon {
  ref = WeaponRef.MetalKnuckle;
  name = 'Metal Knuckle';
  type = 'knuckle';
  hits = 18;
  price = 320;
  maxMaterias = 1;
  zoneAvailable = 3;
}
