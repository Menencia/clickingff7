import { GameService } from '../game.service';
import { random } from '../utils';
import { Attack } from './attack';
import { Enemy } from './enemy';
import { MAX_FIGHTS } from './zone';

export class Enemies {

  list: Enemy[];
  arrHits: number[];
  timer: number;

  hits: number;
  hp: number;
  hpMax: number;
  resistance: string[];
  weakness: string[];

  /**
   * Init
   */
  constructor(public game: GameService) {
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
  fightRandom(): void {
    let levelSum = this.game.characters.levelSum;
    const zone = this.game.zones.current();

    let range;
    range = Math.floor((zone.nbFights / MAX_FIGHTS) * 4);
    range = Math.min(range, 3);

    const enemy = zone.enemies[random(0, range)];

    if (enemy.miboss) {
      levelSum *= 1.2;
    }

    enemy.toLevel(levelSum);

    this.list = [enemy];
  }

  /**
   * Fight against the zone boss
   */
  fightBoss(): void {
    const zone = this.game.zones.current();
    const nbCharacters = this.game.characters.getTeam().length;

    const enemies = zone.boss;
    enemies.forEach(e => {
      e.toLevel(zone.level * (nbCharacters + 1) * 3 * 1.4);
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
   * Get total characters auto hits
   */
  displayAutoHits(hits: number): void {
    this.arrHits.unshift(hits);
    if (this.arrHits.length > 5) {
      this.arrHits.pop();
    }
  }

  /**
   * Enemies auto-attack process
   */
  autoFighting(): void {
    this.timer = window.setTimeout(() => {
      const pwr = this.getHits();
      const alive = this.game.characters.getAutoAttacked(new Attack(pwr));

      if (alive) {
        this.autoFighting();
      } else {
        this.game.battle.end(false);
      }
    }, 1000);
  }

  /**
   * Stop fighting
   */
  stopFighting(): void {
    clearTimeout(this.timer);
  }

  /**
   * Enemies are under auto attack
   */
  getAutoAttacked(attack: Attack): boolean {
    let hits = attack.getHits();

    // weakness
    if (this.hasWeakness(attack.type)) {
      hits *= 3;
    }

    // resistance
    if (this.hasResistance(attack.type)) {
      hits = Math.floor(hits / 10);
    }

    this.hp -= hits;
    this.game.characters.displayAutoHits(hits);

    if (this.hp <= 0) {
      this.hp = 0;

      return false;
    }
    return true;
  }

  /**
   * Enemies are under manual attack
   */
  getAttacked(attack: Attack): void {
    let hits = attack.getHits();

    // weakness
    if (this.hasWeakness(attack.type)) {
      hits *= 3;
    }

    // resistance
    if (this.hasResistance(attack.type)) {
      hits = Math.floor(hits / 3);
    }

    this.hp -= hits;
    this.game.characters.displayHits(hits);

    if (this.hp <= 0) {
      this.hp = 0;
      this.game.battle.end(true);
    }
  }

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasWeakness(types: string[]): boolean {
    return this.weakness.filter(x => types.includes(x)).length > 0;
  }

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasResistance(types: string[]): boolean {
    return this.resistance.filter(x => types.includes(x)).length > 0;
  }

  /**
   * Returns in pixels enemy bar width
   */
  hpProgress(pixelsMax: number): number {
    return this.hp / this.hpMax * pixelsMax;
  }

  /**
   * Remove all the enemy
   */
  remove(): void {
    this.list = [];
    this.refresh();
  }

}
