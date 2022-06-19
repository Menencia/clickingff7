import { Enemy } from '../../enemy'

export class Reno extends Enemy {

  name = 'Turks:Reno'
  image = '/assets/images/enemies/zone4/reno.png'
  baseHpMax = 5
  baseHits = 5
  baseXp = 5
  baseAp = 5
  baseGils = 5
  resistance = ['bolt', 'fire', 'ice']
  boss = true

}
