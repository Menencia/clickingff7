import { GameService } from '../game.service';
import { Materia } from './materia';
import { MateriaSave } from './save';

export class Materias {

  list: Materia[];

  /**
   * Init
   */
  constructor(public game: GameService) {
    this.list = [];
  }

  /**
   * Add a materia
   */
  add(materia: Materia, equipped = false): void {
    materia.equipped = (materia.canEquip()) ? equipped : false;
    this.list.push(materia);
  }

  /**
   * Returns equipped materias
   */
  getEquipped(): Materia[] {
    return this.list.filter(e => e.equipped);
  }

  /**
   * Get unequipped materias
   */
  getUnequipped(): Materia[] {
    return this.list.filter(e => !e.equipped);
  }

  /**
   * Export all materias
   */
  export(): MateriaSave[] {
    const json = [];
    for (const m of this.list) {
      json.push(m.export());
    }
    return json;
  }

}
