import { Enemy } from '../../enemy';

export class AeroCombatant extends Enemy {
  name = 'Aero Combatant';

  image = '/assets/images/enemies/zone4/aero-combatant.png';

  baseHpMax = 2;

  baseHits = 2;

  baseXp = 3;

  baseAp = 1;

  baseGils = 3;

  override weakness = ['bolt'];
}
