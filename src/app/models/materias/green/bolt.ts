import { AttackMateria } from '../attack-materia';

export class Bolt extends AttackMateria {

  name = 'Bolt';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  zoneAvailable = 1;
  elements = ['bolt'];

}
