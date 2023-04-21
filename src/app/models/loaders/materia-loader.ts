import { Materia } from '../materia';
import { Bolt } from '../materias/green/bolt';
import { Earth } from '../materias/green/earth';
import { Fire } from '../materias/green/fire';
import { Ice } from '../materias/green/ice';
import { Poison } from '../materias/green/poison';
import { Restore } from '../materias/green/restore';
import { ChocoMog } from '../materias/red/choco-mog';
import { MateriaRef } from '../refs/materias';

export class MateriaLoader {

  /**
   *
   */
  static build(ref: MateriaRef): Materia {
    let materia;
    switch (ref) {
      case MateriaRef.Bolt:
        materia = new Bolt();
        break;
      case MateriaRef.ChocoMog:
        materia = new ChocoMog();
        break;
      case MateriaRef.Earth:
        materia = new Earth();
        break;
      case MateriaRef.Fire:
        materia = new Fire();
        break;
      case MateriaRef.Ice:
        materia = new Ice();
        break;
      case MateriaRef.Poison:
        materia = new Poison();
        break;
      case MateriaRef.Restore:
        materia = new Restore();
        break;
      default:
        throw new Error('Materia not found');
    }
    return materia;
  }

}
