import { Signal, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ItActionAttack } from './actions/action';
import { ElementType } from './element-type';

export interface ItDisplayHits {
  hits: number;
  /** Critical hit, displayed bigger and in another color */
  critical?: boolean;
  /** Hit on a weakness, labelled as such */
  weakness?: boolean;
  /** Healing rather than damage, displayed in green */
  heal?: boolean;
}

export abstract class Units {
  hp = signal(0);

  abstract readonly hpMax: Signal<number>;

  /**
   * Hits received or healed, shown as floating numbers on the HP bar
   */
  readonly hitEvents = new Subject<ItDisplayHits>();

  weakness: ElementType[] = [];
  resistance: ElementType[] = [];

  /**
   * Hits are divided by this when the unit resists the attack
   */
  protected abstract readonly resistanceDivisor: number;

  abstract getAttackSkill(): ItActionAttack;
  abstract isAlive(): boolean;

  /**
   * Returns true if the unit is weak to one of these elements
   */
  hasWeakness(elements: ElementType[]): boolean {
    return this.weakness.some((x) => elements.includes(x));
  }

  /**
   * Returns true if the unit resists one of these elements
   */
  hasResistance(elements: ElementType[]): boolean {
    return this.resistance.some((x) => elements.includes(x));
  }

  /**
   * Applies weakness (x3) then resistance (/ resistanceDivisor) to the hits
   */
  protected applyAffinities(hits: number, elements: ElementType[]): number {
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
