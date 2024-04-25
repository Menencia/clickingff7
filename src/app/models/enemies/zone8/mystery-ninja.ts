import { Enemy } from '../../enemy';

export class MysteryNinja extends Enemy {
  name = 'Mystery Ninja';
  image = '/assets/images/enemies/zone8/mystery-ninja.png';
  baseHpMax = 5;
  baseHits = 5;
  baseXp = 5;
  baseAp = 5;
  baseGils = 5;
  override boss = true;
}
