import { WeaponRef } from '../../refs/weapons';
import { Weapon } from '../../weapon';

export class MythrilClaw extends Weapon {

  ref = WeaponRef.MythrilClaw;
  name = 'Mythril Claw';
  type = 'knuckle';
  hits = 24;
  price = 1100;
  maxMaterias = 1;
  zoneAvailable = 7;

}
