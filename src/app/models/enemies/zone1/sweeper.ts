import { Enemy } from '../../enemy';

export class Sweeper extends Enemy {
  name = 'Sweeper';

  image = '/assets/images/enemies/zone1/sweeper.png';

  baseHpMax = 3;

  baseHits = 4;

  baseXp = 4;

  baseAp = 1;

  baseGils = 5;

  override weakness = ['bolt'];
}
