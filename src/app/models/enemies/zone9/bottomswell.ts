import { Enemy } from '../../enemy';

export class Bottomswell extends Enemy {
  name = 'Bottomswell';

  image = '/assets/images/enemies/zone9/bottomswell.png';

  baseHpMax = 5;

  baseHits = 5;

  baseXp = 5;

  baseAp = 5;

  baseGils = 5;

  override weakness = ['bolt', 'wind'];

  override boss = true;
}
