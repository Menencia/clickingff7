import { Enemy } from '../../enemy';

export class WholeEater extends Enemy {

  name = 'Whole Eater';
  image = '/assets/images/enemies/zone3/whole-eater.png';
  baseHpMax = 2;
  baseHits = 3;
  baseXp = 2;
  baseAp = 2;
  baseGils = 2;
  weakness = ['fire'];

}
