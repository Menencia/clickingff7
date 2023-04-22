import { Enemy } from '../../enemy';

export class MidgarZolom extends Enemy {

  name = 'Midgar Zolom';
  image = '/assets/images/enemies/zone7/midgar-zolom.png';
  baseHpMax = 5;
  baseHits = 5;
  baseXp = 5;
  baseAp = 5;
  baseGils = 5;
  override weakness = ['bolt'];
  override boss = true;

}
