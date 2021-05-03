import { Enemy } from '../../enemy';

export class HedgehogPie extends Enemy {

  name = 'Hedgehog Pie';
  image = '/assets/images/enemies/zone3/hedgehog-pie.png';
  baseHpMax = 3;
  baseHits = 3;
  baseXp = 3;
  baseAp = 2;
  baseGils = 1;
  weakness = ['bolt'];

}
