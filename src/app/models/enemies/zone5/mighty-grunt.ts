import { Enemy } from '../../enemy'

export class MightyGrunt extends Enemy {

  name = 'Mighty Grunt'
  image = '/assets/images/enemies/zone5/mighty-grunt.png'
  baseHpMax = 4
  baseHits = 2
  baseXp = 3
  baseAp = 1
  baseGils = 3
  weakness = ['bolt']

}
