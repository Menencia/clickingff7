import { Signal, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ItActionAttack } from '../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../core/interfaces/it-display-hits';

export abstract class Units {
  hp = signal(0);

  abstract readonly hpMax: Signal<number>;

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  weakness: string[] = [];
  resistance: string[] = [];

  /**
   * Hits are divided by this when the unit resists the attack
   */
  protected abstract readonly resistanceDivisor: number;

  abstract getAttackSkill(): ItActionAttack;
  abstract isAlive(): boolean;

  /**
   * Returns true if the unit is weak to one of these types
   */
  hasWeakness(types: string[]): boolean {
    return this.weakness.filter((x) => types.includes(x)).length > 0;
  }

  /**
   * Returns true if the unit resists one of these types
   */
  hasResistance(types: string[]): boolean {
    return this.resistance.filter((x) => types.includes(x)).length > 0;
  }

  /**
   * Applies weakness (x3) then resistance (/ resistanceDivisor) to the hits
   */
  protected applyAffinities(hits: number, elements: string[]): number {
    let result = hits;
    if (this.hasWeakness(elements)) {
      result *= 3;
    }
    if (this.hasResistance(elements)) {
      result = Math.floor(result / this.resistanceDivisor);
    }
    return result;
  }
}
