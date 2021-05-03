import { AttackMateria } from '../attack-materia';

export class Ice extends AttackMateria {

  name = 'Ice';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  elements = ['ice'];
  zoneAvailable = 1;

}
