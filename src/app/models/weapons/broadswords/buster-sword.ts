import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class BusterSword extends Weapon {

  ref = WeaponRef.BusterSword;
  name = 'Buster Sword';
  type = 'broadsword';
  hits = 18;
  price = 170;
  maxMaterias = 1;
  zoneAvailable = 1;

}
