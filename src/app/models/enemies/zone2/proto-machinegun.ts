import { Enemy } from '../../enemy';

export class ProtoMachinegun extends Enemy {
  name = 'Proto Machinegun';

  image = '/assets/images/enemies/zone2/proto-machinegun.png';

  baseHpMax = 1;

  baseHits = 4;

  baseXp = 2;

  baseAp = 1;

  baseGils = 1;

  override weakness = ['bolt'];
}
