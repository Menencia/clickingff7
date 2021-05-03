import { Enemy } from '../../enemy';

export class GuardScorpion extends Enemy {

  name = 'Guard Scorpion';
  image = '/assets/images/enemies/zone1/guard-scorpion.png';
  baseHpMax = 4;
  baseHits = 3;
  baseXp = 3;
  baseAp = 3;
  baseGils = 3;
  weakness = ['bolt'];
  resistance = [];
  boss = true;
  miboss = false;

}
