import { BattleService } from '../core/services/battle.service';

export abstract class Units {
  abstract hp: number;

  abstract useAttackSkill(battleService: BattleService): Promise<void>;
  abstract isAlive(): boolean;
}
