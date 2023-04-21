import { Enemy } from '../../enemy';

export class SwordDance extends Enemy {

  name = 'Sword Dance';
  image = '/assets/images/enemies/zone5/sword-dance.png';
  baseHpMax = 1;
  baseHits = 3;
  baseXp = 1;
  baseAp = 1;
  baseGils = 0;
  weakness = ['bolt'];

}
