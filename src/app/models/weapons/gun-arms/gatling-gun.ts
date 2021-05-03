import { Weapon } from '../../weapon';

export class GatlingGun extends Weapon {

  name = 'Gatling Gun';
  type = 'gun-arm';
  hits = 14;
  price = 130;
  maxMaterias = 1;
  zoneAvailable = 1;

}
