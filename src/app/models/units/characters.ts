import { Subject } from 'rxjs';

import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { Attack } from '../actions/attack';
import { Character } from '../character';
import { CharactersSave } from '../save';
import { Units } from '../units';

// maximum characters in the team
export const MAX_TEAM = 3;

export class Characters extends Units {
  list: Character[];

  arrHits: number[];

  selected: Character;

  hits: number;

  hp: number;

  hpMax: number;

  mp: number;

  mpMax: number;

  limit: number;

  limitMax: number;

  levelMax: number;

  levelSum: number;

  weakness: string[];

  resistance: string[];

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  constructor() {
    super();

    // list of characters
    this.list = [];

    // Array of recent hits
    this.arrHits = [];

    // current selected character in menus
    const [first] = this.list;
    this.selected = first;

    // Init
    this.hits = 0;
    this.hp = 0;
    this.hpMax = 0;
    this.mp = 0;
    this.mpMax = 0;
    this.limit = 0;
    this.limitMax = 0;
    this.levelMax = 0;
    this.levelSum = 0;
    this.weakness = [];
    this.resistance = [];
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

  /**
   * Add a character
   */
  add(character: Character, inTeam: boolean): void {
    character.inTeam = inTeam;
    this.list.push(character);
  }

  /**
   * Returns the in-team characters
   */
  getTeam(): Character[] {
    return this.list.filter((e) => e.inTeam && !e.isNotAvailable);
  }

  /**
   * Returns the backup (not in team) characters
   */
  getBackup(): Character[] {
    return this.list.filter((e) => !e.inTeam && !e.isNotAvailable);
  }

  getMaxMaterias(): number {
    let maxMaterias = 0;

    this.getTeam().forEach((character) => {
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

    this.getTeam().forEach((character) => {
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
   * Remove characters from the team if not available
   */
  available(zonelevelMax: number): void {
    this.list.forEach((c) => {
      if (c.notAvailable(zonelevelMax)) {
        c.isNotAvailable = true;
        c.inTeam = false;
      } else {
        c.isNotAvailable = false;
      }
    });
  }

  /**
   * Select a character in menus
   */
  select(character: null | Character = null): void {
    this.selected = character || this.getTeam()[0];
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
  export(): CharactersSave {
    const res: CharactersSave = {
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
