import { Enemy } from '../../enemy'

export class MotorBall extends Enemy {

  name = 'MotorBall'
  image = '/assets/images/enemies/zone6/motor-ball.png'
  baseHpMax = 5
  baseHits = 5
  baseXp = 5
  baseAp = 5
  baseGils = 5
  weakness = ['bolt']
  boss = true

}
