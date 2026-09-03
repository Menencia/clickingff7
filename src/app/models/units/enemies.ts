import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { random } from '../../shared/utils/math.utils';
import { Battle } from '../battle';
import { Enemy } from '../enemy';
import { Units } from '../units';
import { MAX_FIGHTS, Zone } from '../zone';

export class Enemies extends Units {
  list: Enemy[];

  timer: number;

  hits: number;

  /**
   * Init
   */
  constructor() {
    super();
    this.list = [];
    this.arrHits = [];
    this.timer = 0;

    this.hits = 0;
    this.hp.set(0);
    this.hpMax = 0;
    this.resistance = [];
    this.weakness = [];
  }

  /**
   * Fight against a random enemy
   */
  fightRandom(levelSumBase: number, zone: Zone, difficulty: number): Enemy[] {
    let range: number;
    range = Math.floor((zone.nbFights / MAX_FIGHTS) * 4);
    range = Math.min(range, 3);

    const enemy = zone.enemies[random(0, range)];

    let levelSum = levelSumBase;
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

    this.list.forEach((enemy) => {
      // HP
      this.hpMax += enemy.getHpMax();
      this.hits += enemy.getHits();
      this.weakness = [...new Set([...this.weakness, ...enemy.weakness])];
      this.resistance = [...new Set([...this.resistance, ...enemy.resistance])];
    });

    this.hp.set(this.hpMax);
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
      use(battle: Battle) {
        battle.characters.getAttacked(hits, this);
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

  /**
   * Remove all the enemy
   */
  remove(): void {
    this.list = [];
    this.refresh();
  }
}
