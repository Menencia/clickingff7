import { Enemy } from '../../enemy';

export class Grunt extends Enemy {
  name = 'Grunt';

  image = '/assets/images/enemies/zone1/grunt.png';

  baseHpMax = 4;

  baseHits = 3;

  baseXp = 3;

  baseAp = 1;

  baseGils = 4;

  override weakness = ['ice'];
}
