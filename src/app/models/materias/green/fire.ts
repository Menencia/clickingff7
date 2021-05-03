import { AttackMateria } from '../attack-materia';

export class Fire extends AttackMateria {

  name = 'Fire';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  elements = ['fire'];
  zoneAvailable = 2;

}
