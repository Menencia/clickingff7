import { Enemy } from '../../enemy';

export class SampleH0512 extends Enemy {

  name = 'Sample:H0512';
  image = '/assets/images/enemies/zone5/sample-h0512.png';
  baseHpMax = 5;
  baseHits = 5;
  baseXp = 5;
  baseAp = 5;
  baseGils = 5;
  override resistance = ['poison'];
  override boss = true;

}
