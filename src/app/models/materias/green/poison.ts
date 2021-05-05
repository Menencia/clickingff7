import { MateriaRef } from '../../refs/materias';
import { AttackMateria } from '../attack-materia';

export class Poison extends AttackMateria {

  ref = MateriaRef.Poison;
  name = 'Poison';
  color = 'green';
  price = 300;
  apBase = 3;
  pwr = 50;
  elements = ['poison'];
  zoneAvailable = 5;

}
