import { MateriaRef } from '../../refs/materias';
import { AttackMateria } from '../attack-materia';

export class Earth extends AttackMateria {
  ref = MateriaRef.Earth;
  name = 'Earth';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  elements = ['earth'];
  zoneAvailable = 7;
}
