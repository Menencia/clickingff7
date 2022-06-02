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
    return this.list.filter(e => e.equipped);
  }

  /**
   * Get unequipped materias
   */
  getUnequipped(): Materia[] {
    return this.list.filter(e => !e.equipped);
  }

  refresh(maxMaterias: number): void {
    const materias = this.getEquipped();
    if (materias.length > maxMaterias) {
      let equipped = true;
      for (const [i, m] of materias.entries()) {
        if (i < maxMaterias) {
          equipped = false;
        }
        m.equipped = equipped;
      }
    }
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
