import { Enemy } from '../../enemy';

export class HellHouse extends Enemy {
  name = 'Hell House';

  image = '/assets/images/enemies/zone3/hell-house.png';

  baseHpMax = 4;

  baseHits = 3;

  baseXp = 5;

  baseAp = 2;

  baseGils = 2;

  override weakness = ['ice'];
}
