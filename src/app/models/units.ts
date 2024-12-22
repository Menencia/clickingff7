import { BattleService } from '../core/services/battle.service';

import { Action } from './action';

export abstract class Units {
  abstract hp: number;

  abstract getAttacked(baseHits: number, context: Action): void;
  abstract addHp(hp: number, context: Action): void;
  abstract useAttackSkill(battleService: BattleService): Promise<void>;
  abstract isAlive(): boolean;
}
