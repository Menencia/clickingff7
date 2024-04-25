import { Subject } from 'rxjs';
import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { BattleService } from '../../core/services/battle.service';
import { random } from '../../utils';
import { Enemy } from '../enemy';
import { Units } from '../units';
import { MAX_FIGHTS, Zone } from '../zone';

export class Enemies extends Units {
  list: Enemy[];
  arrHits: number[];
  timer: number;

  hits: number;
  hp: number;
  hpMax: number;
  resistance: string[];
  weakness: string[];

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  /**
   * Init
   */
  constructor() {
    super();
    this.list = [];
    this.arrHits = [];
    this.timer = 0;

    this.hits = 0;
    this.hp = 0;
    this.hpMax = 0;
    this.resistance = [];
    this.weakness = [];
  }

  /**
   * Fight against a random enemy
   */
  fightRandom(levelSum: number, zone: Zone, difficulty: number): Enemy[] {
    let range;
    range = Math.floor((zone.nbFights / MAX_FIGHTS) * 4);
    range = Math.min(range, 3);

    const enemy = zone.enemies[random(0, range)];

    if (enemy.miboss) {
      levelSum *= 1.2;
    }

    enemy.toLevel(levelSum, difficulty);

    this.list = [enemy];

    return this.list;
  }

  /**
   * Fight against the zone boss
   */
  fightBoss(zone: Zone, nbCharacters: number, difficulty: number): void {
    const enemies = zone.boss;
    enemies.forEach((e) => {
      e.toLevel(zone.level * (nbCharacters + 1) * 3 * 1.4, difficulty);
    });

    this.list = enemies;
  }

  /**
   * Refresh all the enemy
   */
  refresh(): void {
    this.hpMax = 0;
    this.hits = 0;
    this.arrHits = [];
    this.weakness = [];
    this.resistance = [];

    const enemies = this.list;
    for (const enemy of enemies) {
      // HP
      this.hpMax += enemy.getHpMax();
      this.hits += enemy.getHits();
      this.weakness = [...new Set([...this.weakness, ...enemy.weakness])];
      this.resistance = [...new Set([...this.resistance, ...enemy.resistance])];
    }

    this.hp = this.hpMax;
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
   * Get total enemies hits
   */
  getAttackSkill(): ItActionAttack {
    const hits = this.getHits();
    return {
      type: [],
      use(battleService: BattleService) {
        battleService.characters.getAttacked(hits, this);
      },
    };
  }

  /**
   * Enemies are under manual attack
   */
  getAttacked(hits: number, context: ItActionAttack): void {
    // weakness
    if (this.hasWeakness(context.type)) {
      hits *= 3;
    }

    // resistance
    if (this.hasResistance(context.type)) {
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
    this.refresh();
  }
}
