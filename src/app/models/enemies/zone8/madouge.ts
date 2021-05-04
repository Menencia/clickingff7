import { Enemy } from '../../enemy';

export class Madouge extends Enemy {

  name = 'Madouge';
  image = '/assets/images/enemies/zone8/madouge.png';
  baseHpMax = 4;
  baseHits = 3;
  baseXp = 3;
  baseAp = 1;
  baseGils = 3;
  weakness = ['fire'];
  resistance = ['earth'];

}
