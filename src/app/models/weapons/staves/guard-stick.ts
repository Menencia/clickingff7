import { Weapon } from '../../weapon';

export class GuardStick extends Weapon {

  name = 'Guard Stick';
  type = 'stave';
  hits = 12;
  price = 140;
  maxMaterias = 2;
  zoneAvailable = 3;

}
