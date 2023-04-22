import { Enemy } from '../../enemy';

export class Vice extends Enemy {

  name = 'Vice';
  image = '/assets/images/enemies/zone3/vice.png';
  baseHpMax = 2;
  baseHits = 2;
  baseXp = 2;
  baseAp = 2;
  baseGils = 3;
  override weakness = ['fire'];

}
