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
    this.baseHpMax = data.hp ?? 0;
    this.baseHits = data.hits ?? 0;
    this.baseXp = data.xp ?? 0;
    this.baseAp = data.ap ?? 0;
    this.baseGils = data.gils ?? 0;
    this.weakness = data.weakness ?? [];
    this.resistance = data.resistance ?? [];
    this.boss = data.boss ?? false;
    this.miboss = data.miboss ?? false;
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
