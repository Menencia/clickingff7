import { Enemy } from '../../enemy';

export class HellRider extends Enemy {
  name = 'Hell Rider';

  image = '/assets/images/enemies/zone9/hell-rider.png';

  baseHpMax = 4;

  baseHits = 4;

  baseXp = 4;

  baseAp = 2;

  baseGils = 2;

  override weakness = ['poison'];
}
