import { Enemy } from '../../enemy';

export class GuardHound extends Enemy {

  name = 'Guard Hound';
  image = '/assets/images/enemies/zone4/guard-hound.png';
  baseHpMax = 2;
  baseHits = 2;
  baseXp = 2;
  baseAp = 4;
  baseGils = 1;
  override weakness = ['fire'];

}
