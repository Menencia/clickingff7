import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ItActionAttack } from '../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../core/interfaces/it-display-hits';

export abstract class Units {
  arrHits: number[] = [];

  hp = signal(0);

  hpMax = 0;

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  weakness: string[] = [];
  resistance: string[] = [];

  abstract getAttackSkill(): ItActionAttack;
  abstract isAlive(): boolean;

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasWeakness(types: string[]): boolean {
    return this.weakness.filter((x) => types.includes(x)).length > 0;
  }

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasResistance(types: string[]): boolean {
    return this.resistance.filter((x) => types.includes(x)).length > 0;
  }
}
