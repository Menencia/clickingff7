import { Enemy } from '../../enemy';

export class Mp extends Enemy {
  name = 'MP';
  image = '/assets/images/enemies/zone1/mp.png';
  baseHpMax = 2;
  baseHits = 2;
  baseXp = 2;
  baseAp = 1;
  baseGils = 3;
  override weakness = ['ice'];
}
