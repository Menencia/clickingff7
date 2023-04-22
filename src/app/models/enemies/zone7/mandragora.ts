import { Enemy } from '../../enemy';

export class Mandragora extends Enemy {

  name = 'Mandragora';
  image = '/assets/images/enemies/zone7/mandragora.png';
  baseHpMax = 1;
  baseHits = 1;
  baseXp = 1;
  baseAp = 3;
  baseGils = 0;
  override weakness = ['fire'];

}
