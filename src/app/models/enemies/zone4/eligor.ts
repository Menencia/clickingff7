import { Enemy } from '../../enemy';

export class Eligor extends Enemy {

  name = 'Eligor';
  image = '/assets/images/enemies/zone4/eligor.png';
  baseHpMax = 4;
  baseHits = 3;
  baseXp = 4;
  baseAp = 1;
  baseGils = 1;
  weakness = ['bolt'];

}
