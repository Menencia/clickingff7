import { Enemy } from '../../enemy';

export class KalmFang extends Enemy {

  name = 'Kalm Fang';
  image = '/assets/images/enemies/zone7/kalm-fang.png';
  baseHpMax = 2;
  baseHits = 2;
  baseXp = 1;
  baseAp = 1;
  baseGils = 2;
  override weakness = ['fire', 'earth'];

}
