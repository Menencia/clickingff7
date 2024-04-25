import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class MythrilClip extends Weapon {
  ref = WeaponRef.MythrilClip;
  name = 'Mythril Clip';
  type = 'headdresse';
  hits = 24;
  price = 800;
  maxMaterias = 1;
  zoneAvailable = 5;
}
