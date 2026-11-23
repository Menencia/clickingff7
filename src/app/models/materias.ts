import { Materia } from './materia';
import { MateriaSave } from './save';

export class Materias {
  list: Materia[] = [];

  /**
   * Empties the collection in place, for a new game
   */
  clear(): void {
    this.list.length = 0;
  }

  /**
   * Add a materia
   */
  add(materia: Materia, equipped = false): void {
    materia.equipped = equipped;
    this.list.push(materia);
  }

  /**
   * Removes the materia from the list (as a new array)
   */
  remove(materia: Materia): void {
    this.list = this.list.filter((e) => e !== materia);
  }

  /**
   * Returns equipped materias
   */
  getEquipped(): Materia[] {
    return this.list.filter((e) => e.equipped);
  }

  /**
   * Returns true if the materia can be equipped in one of the {max} slots
   */
  canEquip(materia: Materia, max: number): boolean {
    return !materia.equipped && this.getEquipped().length < max;
  }

  /**
   * Equips the materia. Does nothing if no slot is free.
   */
  equip(materia: Materia, max: number): void {
    if (this.canEquip(materia, max)) {
      materia.equipped = true;
    }
  }

  /**
   * Unequips the materia
   */
  unequip(materia: Materia): void {
    materia.equipped = false;
  }

  /**
   * Unequips the last equipped materias until at most {max} remain
   */
  fit(max: number): void {
    this.getEquipped()
      .slice(Math.max(max, 0))
      .forEach((m) => {
        m.equipped = false;
      });
  }

  /**
   * Export all materias
   */
  export(): MateriaSave[] {
    return this.list.map((m) => m.export());
  }
}
