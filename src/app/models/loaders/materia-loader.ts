import { GameService } from 'src/app/game.service';
import { Materia } from '../materia';
import { Bolt } from '../materias/green/bolt';
import { Earth } from '../materias/green/earth';
import { Fire } from '../materias/green/fire';
import { Ice } from '../materias/green/ice';
import { Poison } from '../materias/green/poison';
import { Restore } from '../materias/green/restore';
import { ChocoMog } from '../materias/red/choco-mog';

export enum MateriaRef {
  Bolt = 'Bolt',
  ChocoMog = 'ChocoMog',
  Earth = 'Earth',
  Fire = 'Fire',
  Ice = 'Ice',
  Poison = 'Poison',
  Restore = 'Restore',
}

export class MateriaLoader {

  /**
   *
   */
  static build(ref: string, game: GameService): Materia {
    let materia;
    switch (ref) {
      case MateriaRef.Bolt:
        materia = new Bolt(game);
        break;
      case MateriaRef.ChocoMog:
        materia = new ChocoMog(game);
        break;
      case MateriaRef.Earth:
        materia = new Earth(game);
        break;
      case MateriaRef.Fire:
        materia = new Fire(game);
        break;
      case MateriaRef.Ice:
        materia = new Ice(game);
        break;
      case MateriaRef.Poison:
        materia = new Poison(game);
        break;
      case MateriaRef.Restore:
        materia = new Restore(game);
        break;
      default:
        throw new Error('Materia not found');
    }
    return materia;
  }

}
