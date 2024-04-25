import { Enemy } from '../../enemy';

export class Zemzelett extends Enemy {
  name = 'Zemzelett';
  image = '/assets/images/enemies/zone9/zemzelett.png';
  baseHpMax = 3;
  baseHits = 3;
  baseXp = 3;
  baseAp = 4;
  baseGils = 1;
  override weakness = ['fire'];
}
