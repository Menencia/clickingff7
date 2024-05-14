import { Subject } from 'rxjs';

import { ItActionAttack } from '../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../core/interfaces/it-display-hits';

import { Attack } from './actions/attack';
import { Character } from './character';
import { TeamSave } from './save';
import { Units } from './units';

// maximum characters in the team
export const MAX_TEAM = 3;

/** Handles all player characters */
export class Team extends Units {
  list: Character[] = [];

  arrHits: number[] = [];

  hits: number;

  hp: number;

  hpMax: number;

  mp: number;

  mpMax: number;

  limit: number;

  limitMax: number;

  levelMax = 0;

  levelSum = 0;

  weakness: string[] = [];

  resistance: string[] = [];

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  constructor() {
    super();

    // Init
    this.hits = 0;
    this.hp = 0;
    this.hpMax = 0;

    this.mp = 0;
    this.mpMax = 0;
    this.limit = 0;
    this.limitMax = 0;
  }

  /** Adds a character to the team */
  setCharacters(characters: Character[]) {
    this.list = [...characters];
  }

  /** Adds a character to the team */
  join(character: Character) {
    this.list.push(character);
  }

  /** Adds a character to the team */
  leave(character: Character): void {
    this.list = this.list.filter((c) => c.ref !== character.ref);
  }

  /** Returns true if given character is in team */
  inTeam(characterRef: string): boolean {
    return !!this.list.find((c) => c.ref === characterRef);
  }

  /**
   * Remove characters from the team if not available
   */
  available(zonelevelMax: number): void {
    this.list.forEach((c) => {
      if (c.notAvailable(zonelevelMax)) {
        this.leave(c);
      }
    });
  }

  /**
   *
   */
  addHp(value: number): void {
    this.hp = Math.min(this.hp + value, this.hpMax);
    this.source.hp.next({ hits: value } as ItDisplayHits);
  }

  /**
   *
   */
  addMp(value: number): void {
    this.mp = Math.min(this.mp + value, this.mpMax);
  }

  getMaxMaterias(): number {
    let maxMaterias = 0;

    this.list.forEach((character) => {
      // max materias
      if (character.weapon) {
        maxMaterias += character.weapon.maxMaterias;
      }
    });
    return maxMaterias;
  }

  /*
   * Refresh characters stats
   */
  refresh(): void {
    this.hpMax = 0;
    this.mpMax = 0;
    this.limitMax = 0;
    this.hits = 0;
    this.arrHits = [];
    this.levelMax = 0;
    this.levelSum = 0;

    this.list.forEach((character) => {
      // Level
      if (character.level > this.levelMax) {
        this.levelMax = character.level;
      }

      // HP, MP
      this.hpMax += character.getHpMax();
      this.mpMax += character.getMpMax();

      this.levelSum += character.level;

      this.hits += character.getHits();
    });

    this.limitMax = (2 * this.hpMax) / 3;

    if (this.hp > this.hpMax) {
      this.hp = this.hpMax;
    }
    if (this.mp > this.mpMax) {
      this.mp = this.mpMax;
    }
    if (this.limit > this.limitMax) {
      this.limit = this.limitMax;
    }
  }

  /**
   * Get total characters hits
   */
  getAttackSkill(): ItActionAttack {
    const { hits } = this;
    let pwr = 100;

    // limit
    if (this.canLimit()) {
      pwr = 500;
      this.limit = 0;
    }

    return new Attack(hits, pwr);
  }

  /**
   * Returns in pixels characters hp bar width
   */
  hpProgress(pixelsMax: number): number {
    return (this.hp / this.hpMax) * pixelsMax;
  }

  /**
   * Returns in pixels characters mp bar width
   */
  mpProgress(pixelsMax: number): number {
    return (this.mp / this.mpMax) * pixelsMax;
  }

  /**
   * Returns in pixels characters hp bar width
   */
  limitProgress(pixelsMax: number): number {
    return (this.limit / this.limitMax) * pixelsMax;
  }

  autoFighting(): ItActionAttack {
    return this.getAttackSkill();
  }

  /**
   * Characters are under attack
   */
  getAttacked(baseHits: number, context: ItActionAttack): void {
    let hits = baseHits;

    // weakness
    if (this.hasWeakness(context.type)) {
      hits *= 3;
    }

    // resistance
    if (this.hasResistance(context.type)) {
      hits = Math.floor(hits / 10);
    }

    this.hp = Math.max(this.hp - hits, 0);
    this.source.hp.next({ hits } as ItDisplayHits);

    this.limit = Math.min(this.limit + hits, this.limitMax);
  }

  isAlive(): boolean {
    if (this.hp <= 0) {
      this.limit = 0;
      this.hp = 0;

      return false;
    }

    return true;
  }

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasWeakness(types: string[]): boolean {
    let res = false;
    let i = 0;
    while (!res && i < types.length) {
      if (this.weakness.includes(types[i])) {
        res = true;
      }
      i += 1;
    }
    return res;
  }

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasResistance(types: string[]): boolean {
    let res = false;
    let i = 0;
    while (!res && i < types.length) {
      if (this.resistance.includes(types[i])) {
        res = true;
      }
      i += 1;
    }
    return res;
  }

  /**
   * Returns if it is possible to execute a limit (powerful attack)
   */
  canLimit(): boolean {
    return this.limit === this.limitMax;
  }

  /**
   * Returns data for export
   */
  export(): TeamSave {
    const res: TeamSave = {
      hp: this.hp,
      mp: this.mp,
      limit: this.limit,
      list: [],
    };

    res.list = [];
    this.list.forEach((c) => {
      res.list.push(c.export());
    });

    return res;
  }
}
