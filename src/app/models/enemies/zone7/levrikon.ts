import { Enemy } from '../../enemy';

export class Levrikon extends Enemy {

  name = 'Levrikon';
  image = '/assets/images/enemies/zone7/levrikon.png';
  baseHpMax = 2;
  baseHits = 3;
  baseXp = 3;
  baseAp = 1;
  baseGils = 1;
  override weakness = ['fire', 'earth'];

}
