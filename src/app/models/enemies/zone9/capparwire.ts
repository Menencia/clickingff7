import { Enemy } from '../../enemy';

export class Capparwire extends Enemy {

  name = 'Capparwire';
  image = '/assets/images/enemies/zone9/capparwire.png';
  baseHpMax = 2;
  baseHits = 3;
  baseXp = 2;
  baseAp = 1;
  baseGils = 1;
  override weakness = ['fire'];

}
