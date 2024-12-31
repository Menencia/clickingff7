import { Action } from '@shared/models/action';
import { Subject } from 'rxjs';

import { ItDisplayHits } from '../../interfaces/it-display-hits';
import { addPercent, random } from '../../utils/math.utils';
import { Enemy } from '../enemy';
import { Units } from '../units';

export class Enemies extends Units {
  level = 1;

  arrHits: number[] = [];

  timer: number;

  hits: number;

  hp: number;

  hpMax: number;

  resistance: string[] = [];

  weakness: string[] = [];

  rewardXp = 0;

  rewardAp = 0;

  rewardGils = 0;

  boss = false;

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  /**
   * Init
   */
  constructor(public list: Enemy[]) {
    super();

    this.timer = 0;

    this.hits = 0;
    this.hp = 0;
    this.hpMax = 0;
  }

  /**
   * Get the enemy to the given level
   */
  refresh() {
    let bonusHpMax = 0;
    let bonusHits = 0;
    let bonusXp = 0;
    let bonusAp = 0;
    let bonusGils = 0;

    this.list.forEach((enemy) => {
      bonusHpMax += enemy.hpMax;
      bonusHits += enemy.hits;
      bonusXp += enemy.xp;
      bonusAp += enemy.ap;
      bonusGils += enemy.gils;
    });

    this.hpMax = addPercent(25 * this.level, bonusHpMax);
    this.hp = this.hpMax;
    this.hits = addPercent(3 * this.level, bonusHits);
    this.rewardXp = addPercent(5 * this.level, bonusXp);
    this.rewardAp = addPercent(2 * this.level, bonusAp);
    this.rewardGils = addPercent(30 + this.level, bonusGils);
    // $$$$ todo
    // this.weakness = [...new Set([...this.weakness, ...enemy.weakness])];
    // this.resistance = [...new Set([...this.resistance, ...enemy.resistance])];
  }

  /**
   * Get *random* total characters hits
   */
  getHits(): number {
    const a = this.hits * (1 - 10 / 100);
    const b = this.hits * (1 + 10 / 100);
    return Math.round(random(a, b));
  }

  /**
   * $$$$ Get total enemies hits
   */
  getAttackRawEffects(): string[] {
    return ['damages 1'];
  }

  /**
   * Enemies are under manual attack
   */
  getAttacked(baseHits: number, context: Action): void {
    let hits = baseHits;

    // weakness
    if (this.hasWeakness(context.elements)) {
      hits *= 3;
    }

    // resistance
    if (this.hasResistance(context.elements)) {
      hits = Math.floor(hits / 3);
    }

    this.hp = Math.max(this.hp - hits, 0);
    this.source.hp.next({ hits, context } as ItDisplayHits);
  }

  addHp(hp: number, context: Action) {
    this.source.hp.next({ hits: hp, context } as ItDisplayHits);
  }

  isAlive(): boolean {
    if (this.hp <= 0) {
      this.hp = 0;

      return false;
    }
    return true;
  }

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

  /**
   * Returns in pixels enemy bar width
   */
  hpProgress(pixelsMax: number): number {
    return (this.hp / this.hpMax) * pixelsMax;
  }
}
