import { Enemy } from '../../enemy';

export class Rufus extends Enemy {

  name = 'Rufus';
  image = '/assets/images/enemies/zone6/rufus.png';
  baseHpMax = 3;
  baseHits = 4;
  baseXp = 4;
  baseAp = 4;
  baseGils = 0;
  weakness = ['bolt', 'ice', 'fire'];
  miboss = true;

}
