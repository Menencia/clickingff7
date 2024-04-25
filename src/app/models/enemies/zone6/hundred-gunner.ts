import { Enemy } from '../../enemy';

export class HundredGunner extends Enemy {
  name = 'Hundred Gunner';
  image = '/assets/images/enemies/zone6/hundred-gunner.png';
  baseHpMax = 1;
  baseHits = 3;
  baseXp = 1;
  baseAp = 1;
  baseGils = 0;
  override weakness = ['bolt'];
  override miboss = true;
}
