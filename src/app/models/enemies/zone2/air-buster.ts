import { Enemy } from '../../enemy';

export class AirBuster extends Enemy {

  name = 'Air Buster';
  image = '/assets/images/enemies/zone2/air-buster.png';
  baseHpMax = 5;
  baseHits = 5;
  baseXp = 5;
  baseAp = 5;
  baseGils = 5;
  override weakness = ['bolt'];
  override boss = true;

}
