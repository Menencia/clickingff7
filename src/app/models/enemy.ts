import { EnemyRef } from './refs/enemy';

export interface EnemyJson {
  ref: EnemyRef;
  image: string;
  hp: number;
  hits: number;
  xp: number;
  ap: number;
  gils: number;
  weakness?: string[];
  resistance?: string[];
  boss?: boolean;
  miboss?: boolean;
}

export class Enemy {
  level = 1;

  hpMax = 0;

  hits = 0;

  xp = 0;

  ap = 0;

  gils = 0;

  ref: EnemyRef;

  image: string;

  baseHpMax: number;

  baseHits: number;

  baseXp: number;

  baseAp: number;

  baseGils: number;

  weakness: string[];

  resistance: string[];

  boss: boolean;

  miboss: boolean;

  /**
   * Init
   */
  constructor(data: EnemyJson) {
    this.ref = data.ref;
    this.image = data.image;
    this.baseHpMax = data.hp;
    this.baseHits = data.hits;
    this.baseXp = data.xp;
    this.baseAp = data.ap;
    this.baseGils = data.gils;
    this.weakness = data.weakness ?? [];
    this.resistance = data.resistance ?? [];
    this.boss = data.boss ?? false;
    this.miboss = data.miboss ?? false;
  }

  /**
   * Get the enemy to the given level
   */
  toLevel(levelSumBase: number, difficulty: number): void {
    let levelSum = levelSumBase;

    // Difficulty
    levelSum *= 1 + ((difficulty - 2) * 20) / 100;
    levelSum = Math.ceil(levelSum);

    this.level = Math.ceil(levelSum / 3);

    this.hpMax = Math.ceil(
      (((this.baseHpMax - 3) * 10) / 100 + 1) * 25 * levelSum,
    );
    this.hits = Math.ceil((((this.baseHits - 3) * 10) / 100 + 1) * levelSum);
    this.xp = Math.ceil((((this.baseXp - 3) * 10) / 100 + 1) * 5 * levelSum);
    this.ap = Math.ceil((((this.baseAp - 3) * 10) / 100 + 1) * 2 * levelSum);
    this.gils = Math.ceil(
      (((this.baseGils - 3) * 10) / 100 + 1) * (30 + levelSum),
    );
  }

  /**
   * Returns enemy HP
   */
  getHpMax(): number {
    return this.hpMax;
  }

  /**
   * Returns enemy pwr
   */
  getHits(): number {
    return this.hits;
  }

  /**
   * returns enemy XP reward
   */
  xpReward(): number {
    return this.xp;
  }

  /**
   * returns enemy AP reward
   */
  apReward(): number {
    return this.ap;
  }

  /**
   * returns enemy gils reward
   */
  gilsReward(): number {
    return this.gils;
  }
}
