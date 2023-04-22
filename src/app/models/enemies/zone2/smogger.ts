import { Enemy } from '../../enemy';

export class Smogger extends Enemy {

  name = 'Smogger';
  image = '/assets/images/enemies/zone2/smogger.png';
  baseHpMax = 4;
  baseHits = 2;
  baseXp = 2;
  baseAp = 1;
  baseGils = 3;
  override weakness = ['bolt'];

}
