import { Enemy } from '../../enemy'

export class Formula extends Enemy {

  name = 'Formula'
  image = '/assets/images/enemies/zone9/formula.png'
  baseHpMax = 3
  baseHits = 2
  baseXp = 3
  baseAp = 2
  baseGils = 3
  weakness = ['wind']

}
