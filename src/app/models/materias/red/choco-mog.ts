import { MateriaRef } from '../../refs/materias';
import { AttackMateria } from '../attack-materia';

export class ChocoMog extends AttackMateria {

  ref = MateriaRef.ChocoMog;
  name = 'Choco/Mog';
  color = 'red';
  price = 600;
  apBase = 4;
  pwr = 400;
  elements = ['wind'];
  zoneAvailable = 7;

}
