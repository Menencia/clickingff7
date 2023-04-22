import { Enemy } from '../../enemy';

export class Crawler extends Enemy {

  name = 'Crawler';
  image = '/assets/images/enemies/zone8/crawler.png';
  baseHpMax = 1;
  baseHits = 2;
  baseXp = 1;
  baseAp = 1;
  baseGils = 2;
  override weakness = ['fire'];

}
