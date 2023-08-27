import { BattleService } from 'src/app/core/services/battle.service';
import { ActionSub } from '../action-sub';

export class CureMP extends ActionSub {

  constructor(private baseHits: number) {
    super();
  }

  use(battleService: BattleService): void {
    battleService.characters.addMp(this.baseHits, this);
  }
}
