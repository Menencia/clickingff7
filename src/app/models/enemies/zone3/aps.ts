import { Enemy } from '../../enemy';

export class Aps extends Enemy {
  name = 'Aps';
  image = '/assets/images/enemies/zone3/aps.png';
  baseHpMax = 5;
  baseHits = 5;
  baseXp = 5;
  baseAp = 5;
  baseGils = 5;
  override weakness = ['fire'];
  override boss = true;
}
