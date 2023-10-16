import { ItActionAttack } from "../core/interfaces/it-action-attack";

export abstract class Units {
  abstract getAttackSkill(): ItActionAttack;
  abstract isAlive(): boolean;
}
