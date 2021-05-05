import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class MythrilRod extends Weapon {

  ref = WeaponRef.MythrilRod;
  name = 'Mythril Rod';
  type = 'stave';
  hits = 16;
  price = 370;
  maxMaterias = 2;
  zoneAvailable = 3;

}
