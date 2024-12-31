import { Action } from './action';

export abstract class Units {
  abstract hp: number;

  abstract getAttacked(baseHits: number, context: Action): void;
  abstract addHp(hp: number, context: Action): void;
  abstract getAttackRawEffects(): string[];
  abstract isAlive(): boolean;
}
