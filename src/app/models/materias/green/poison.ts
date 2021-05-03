import { AttackMateria } from '../attack-materia';

export class Poison extends AttackMateria {

  name = 'Poison';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  elements = ['poison'];
  zoneAvailable = 5;

}
