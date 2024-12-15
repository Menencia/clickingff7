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
  hpMax = 0;

  hits = 0;

  xp = 0;

  ap = 0;

  gils = 0;

  constructor(public readonly data: Readonly<EnemyJson>) {}

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
