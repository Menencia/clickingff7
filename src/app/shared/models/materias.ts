import { Materia } from './materia';
import { MateriaSave } from './save';

export class Materias {
  list: Materia[];

  /**
   * Init
   */
  constructor() {
    this.list = [];
  }

  /**
   * Add a materia
   */
  add(materia: Materia, equipped = false): void {
    materia.equipped = equipped;
    this.list.push(materia);
  }

  /**
   * Returns equipped materias
   */
  getEquipped(): Materia[] {
    return this.list.filter((e) => e.equipped);
  }

  /**
   * Get unequipped materias
   */
  getUnequipped(): Materia[] {
    return this.list.filter((e) => !e.equipped);
  }

  /**
   * Export all materias
   */
  export(): MateriaSave[] {
    const json: MateriaSave[] = [];
    this.list.forEach((m) => {
      json.push(m.export());
    });
    return json;
  }
}
