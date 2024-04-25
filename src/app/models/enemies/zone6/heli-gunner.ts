import { Enemy } from '../../enemy';

export class HeliGunner extends Enemy {
  name = 'Heli Gunner';

  image = '/assets/images/enemies/zone6/heli-gunner.png';

  baseHpMax = 2;

  baseHits = 1;

  baseXp = 3;

  baseAp = 3;

  baseGils = 0;

  override weakness = ['bolt'];

  override miboss = true;
}
