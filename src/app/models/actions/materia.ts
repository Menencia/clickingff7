import { BattleService } from '../../core/services/battle.service';
import { Materia } from '../materia';
import { Attack } from '../action-subs/attack';
import { AttackMateria } from '../materias/attack-materia';
import { Action } from '../action';

export class MateriaAction extends Action {

  public critical = false;

  constructor(public materia: Materia) {
    super();
  }

  /** Can use the materia? */
  canUse(battleService: BattleService): boolean {
    return battleService.isBattle && battleService.characters.mp >= this.materia.getMpCost();
  }

  use(battleService: BattleService) {
    const actionSubs = this.materia.getActionSubs(battleService);
    this.doActionSubs(actionSubs, battleService);
  }

  // getSubActions(battleService: BattleService): Attack[] {
  //   const hits = battleService.characters.hits;
  //   const attack = new Attack(
  //     hits,
  //     (this.materia as AttackMateria).getPwr(),
  //     (this.materia as AttackMateria).elements
  //   );
  //   return [attack];
  // }

}
