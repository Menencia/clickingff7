import { GameService } from '../game.service';

export abstract class Enemy {

  level: number;
  hpMax: number;
  hits: number;
  xp: number;
  ap: number;
  gils: number;

  abstract name: string;
  abstract image: string;
  abstract baseHpMax: number;
  abstract baseHits: number;
  abstract baseXp: number;
  abstract baseAp: number;
  abstract baseGils: number;
  abstract weakness: string[];
  abstract resistance: string[];
  abstract boss: boolean;
  abstract miboss: boolean;

  /**
   * Init
   */
  constructor(public game: GameService) {
    this.level = 0;
    this.hpMax = 0;
    this.hits = 0;
    this.xp = 0;
    this.ap = 0;
    this.gils = 0;
  }

  /**
   * Get the enemy to the given level
   */
  toLevel(levelSum: number): void {

    // Difficulty
    levelSum *= (1 + (this.game.difficulty - 2) * 20 / 100);
    levelSum = Math.ceil(levelSum);

    this.level = Math.ceil(levelSum / 3);

    this.hpMax = Math.ceil(((this.baseHpMax - 3) * 10 / 100 + 1) * 25 * levelSum);
    this.hits = Math.ceil(((this.baseHits - 3) * 10 / 100 + 1) * levelSum);
    this.xp = Math.ceil(((this.baseXp - 3) * 10 / 100 + 1) * 5 * levelSum);
    this.ap = Math.ceil(((this.baseAp - 3) * 10 / 100 + 1) * 2 * levelSum);
    this.gils = Math.ceil(((this.baseGils - 3) * 10 / 100 + 1) * (30 + levelSum));
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
