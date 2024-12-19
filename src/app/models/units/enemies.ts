import { Subject } from 'rxjs';
import { Action } from 'src/app/core/interfaces/action';
import { Difficulty } from 'src/app/shared/interfaces/difficulty';

import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { BattleService } from '../../core/services/battle.service';
import { addPercent, random } from '../../shared/utils/math.utils';
import { Enemy } from '../enemy';
import { Units } from '../units';
import { MAX_FIGHTS, Zone } from '../zone';

export class Enemies extends Units {
  list: Enemy[] = [];

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
  constructor() {
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
   * Fight against a random enemy
   */
  fightRandom(zone: Zone, difficulty: Difficulty) {
    // pick enemy
    let range;
    range = Math.floor((zone.nbFights / MAX_FIGHTS) * 4);
    range = Math.min(range, 3);
    const enemy = zone.enemies[random(0, range)];
    this.list = [enemy];

    // determine level
    this.level = Math.max(1, (zone.data.level - 1) * 5 + (range + 1) + (difficulty - 2));

    // update stats
    this.refresh();

    // random enemy
    this.boss = false;
  }

  /**
   * Fight against the zone boss
   */
  fightBoss(zone: Zone, difficulty: number): void {
    // pick enemy
    this.list = zone.boss;

    // determine level
    this.level = zone.data.level * 5 + (difficulty - 2);

    // update stats
    this.refresh();

    // the boss is real
    this.boss = true;
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
  async useAttackSkill(): Promise<void> {
    // TODO
  }

  /**
   * Get total enemies hits
   */
  getAttackSkillTemp(): ItActionAttack {
    const hits = this.getHits();
    return {
      type: [],
      use(battleService: BattleService) {
        battleService.team.getAttacked(hits, this);
      },
    };
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
    this.source.hp.next({ hits } as ItDisplayHits);
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

  /**
   * Remove all the enemy
   */
  remove(): void {
    this.list = [];
  }
}
