import { Enemy } from '../../enemy';

export class Elfadunk extends Enemy {
  name = 'Elfadunk';
  image = '/assets/images/enemies/zone7/elfadunk.png';
  baseHpMax = 4;
  baseHits = 2;
  baseXp = 1;
  baseAp = 2;
  baseGils = 1;
  override weakness = ['earth'];
}
