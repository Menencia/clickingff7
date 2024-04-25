import { Enemy } from '../../enemy';

export class Castanets extends Enemy {
  name = 'Castanets';

  image = '/assets/images/enemies/zone8/castanets.png';

  baseHpMax = 2;

  baseHits = 2;

  baseXp = 2;

  baseAp = 2;

  baseGils = 1;

  override weakness = ['fire', 'earth'];
}
