import { MateriaRef } from '../../refs/materias';
import { CureMateria } from '../cure-materia';

export class Restore extends CureMateria {
  ref = MateriaRef.Restore;
  name = 'Restore';
  color = 'green';
  price = 400;
  apBase = 2;
  pwr = 20;
  zoneAvailable = 7;
}
