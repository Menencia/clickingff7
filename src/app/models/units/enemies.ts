import { signal } from '@angular/core';
import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { withVariance } from '../../shared/utils/game.utils';
import { Context } from '../context';
import { Enemy } from '../enemy';
import { Units } from '../units';

export class Enemies extends Units {
  list: Enemy[];

  hits: number;

  readonly hpMax = signal(0);

  /**
   * Init
   */
  constructor() {
    super();
    this.list = [];

    this.hits = 0;
    this.hp.set(0);
    this.resistance = [];
    this.weakness = [];
  }

  /**
   * Refresh all the enemy
   */
  refresh(): void {
    let hpMax = 0;
    this.hits = 0;
    this.weakness = [];
    this.resistance = [];

    this.list.forEach((enemy) => {
      // HP
      hpMax += enemy.getHpMax();
      this.hits += enemy.getHits();
      this.weakness = [...new Set([...this.weakness, ...enemy.weakness])];
      this.resistance = [...new Set([...this.resistance, ...enemy.resistance])];
    });

    this.hpMax.set(hpMax);
    this.hp.set(hpMax);
  }

  /**
   * Get *random* total characters hits
   */
  getHits(): number {
    return withVariance(this.hits);
  }

  /**
   * Get total enemies hits
   */
  getAttackSkill(): ItActionAttack {
    const hits = this.getHits();
    return {
      type: [],
      use(context: Context) {
        context.characters.getAttacked(hits, this);
      },
    };
  }

  /**
   * Enemies are under manual attack
   */
  getAttacked(baseHits: number, context: ItActionAttack): void {
    let hits = baseHits;

    // weakness
    if (this.hasWeakness(context.type)) {
      hits *= 3;
    }

    // resistance
    if (this.hasResistance(context.type)) {
      hits = Math.floor(hits / 3);
    }

    this.hp.update((hp) => Math.max(hp - hits, 0));
    this.source.hp.next({ hits } as ItDisplayHits);
  }

  isAlive(): boolean {
    return this.hp() > 0;
  }
}
