import { Enemy } from '../../enemy';

export class SpecialCombatant extends Enemy {

  name = 'Special Combatant';
  image = '/assets/images/enemies/zone2/special-combatant.png';
  baseHpMax = 3;
  baseHits = 4;
  baseXp = 4;
  baseAp = 1;
  baseGils = 5;
  weakness = ['bolt'];
  resistance = [];
  boss = false;
  miboss = false;

}
