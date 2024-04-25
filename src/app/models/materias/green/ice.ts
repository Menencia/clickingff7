import { MateriaRef } from '../../refs/materias';
import { AttackMateria } from '../attack-materia';

export class Ice extends AttackMateria {
  ref = MateriaRef.Ice;

  name = 'Ice';

  color = 'green';

  price = 300;

  apBase = 3;

  pwr = 50;

  elements = ['ice'];

  zoneAvailable = 1;
}
