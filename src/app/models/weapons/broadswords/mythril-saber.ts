import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class MythrilSaber extends Weapon {
  ref = WeaponRef.MythrilSaber;

  name = 'Mythril Saber';

  type = 'broadsword';

  hits = 23;

  price = 1000;

  maxMaterias = 1;

  zoneAvailable = 7;
}
