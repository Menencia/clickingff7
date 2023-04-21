import { Enemy } from '../../enemy';

export class Deenglow extends Enemy {

  name = 'Deenglow';
  image = '/assets/images/enemies/zone4/deenglow.png';
  baseHpMax = 2;
  baseHits = 4;
  baseXp = 3;
  baseAp = 2;
  baseGils = 0;
  weakness = ['ice'];

}
