import { Enemy } from '../../enemy';

export class VargidPolice extends Enemy {

  name = 'VargidPolice';
  image = '/assets/images/enemies/zone5/vargid-police.png';
  baseHpMax = 2;
  baseHits = 1;
  baseXp = 3;
  baseAp = 3;
  baseGils = 0;
  override weakness = ['fire', 'poison'];

}
