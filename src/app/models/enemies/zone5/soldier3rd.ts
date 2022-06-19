import { Enemy } from '../../enemy'

export class Soldier3rd extends Enemy {

  name = 'SOLDIER:3rd'
  image = '/assets/images/enemies/zone5/soldier-3rd.png'
  baseHpMax = 3
  baseHits = 4
  baseXp = 4
  baseAp = 4
  baseGils = 0
  weakness = ['poison']

}
