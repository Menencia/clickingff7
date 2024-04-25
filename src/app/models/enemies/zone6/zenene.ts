import { Enemy } from '../../enemy';

export class Zenene extends Enemy {
  name = 'Zenene';

  image = '/assets/images/enemies/zone6/zenene.png';

  baseHpMax = 4;

  baseHits = 2;

  baseXp = 3;

  baseAp = 1;

  baseGils = 3;

  override weakness = ['fire', 'poison'];
}
