import { signal } from '@angular/core';
import { Skill } from '@shared/models/skill';
import { addPercent, random } from '../../utils/math.utils';
import { Enemy } from '../enemy';
import { Units } from '../units';

export class Enemies extends Units {
  timer: number;

  hits: number;

  stagger = signal(0);

  staggerMax: number;

  rewardXp = 0;

  rewardAp = 0;

  rewardGils = 0;

  boss = false;

  /**
   * Init
   */
  constructor(public list: Enemy[]) {
    super();

    this.timer = 0;

    this.hits = 0;
    this.hpMax = 0;
    this.staggerMax = 0;
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

    this.hpMax = addPercent(25 * this.level(), bonusHpMax);
    this.hp.set(this.hpMax);
    this.staggerMax = this.hpMax * 2;
    this.hits = addPercent(3 * this.level(), bonusHits);
    this.rewardXp = addPercent(5 * this.level(), bonusXp);
    this.rewardAp = addPercent(2 * this.level(), bonusAp);
    this.rewardGils = addPercent(30 + this.level(), bonusGils);
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

  addHp(_hp: number, _context: Skill) {
    // this.source.hp.next({ hits: hp, context });
  }

  isAlive(): boolean {
    if (this.hp() <= 0) {
      this.hp.set(0);

      return false;
    }
    return true;
  }

  /**
   * Returns in pixels enemy bar width
   */
  hpProgress(pixelsMax: number): number {
    return (this.hp() / this.hpMax) * pixelsMax;
  }
}
