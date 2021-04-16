import { GameService } from 'src/app/game.service';
import { Materia } from '../materia';
import { Bolt } from '../materias/green/bolt';
import { Restore } from '../materias/green/restore';

export enum MateriaRef {
  Restore = 'Restore',
  Bolt = 'Bolt'
}

export class MateriaLoader {

  /**
   *
   */
  static build(ref: string, game: GameService): Materia {
    let materia;
    switch (ref) {
      case MateriaRef.Restore:
        materia = new Restore(game);
        break;
      case MateriaRef.Bolt:
        materia = new Bolt(game);
        break;
      default:
        throw new Error('Materia not found');
    }
    return materia;
  }

}
