import { Subject } from 'rxjs';

import { ItActionAttack } from '../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../core/interfaces/it-display-hits';
import { addPercent } from '../shared/utils/math.utils';

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

  hp = 0;

  hpMax = 0;

  mp = 0;

  mpMax = 0;

  limit = 0;

  limitMax = 0;

  level = 1;

  xp = 0;

  attack = 0;

  attackFromEquipment = 0;

  strengh = 0;

  defense = 0;

  defenseFromEquipment = 0;

  vitality = 0;

  luck = 0;

  luckFromEquipment = 0;

  speed = 0;

  speedFromEquipment = 0;

  critHitRate = 0;

  critHitDamage = 0;

  weakness: string[] = [];

  resistance: string[] = [];

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  /** Updates team data */
  load(data: TeamSave): Team {
    this.level = data.level;
    this.xp = data.xp;
    this.hp = data.hp;
    this.mp = data.mp;
    this.limit = data.limit;
    return this;
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
    this.list = this.list.filter((c) => c.data.ref !== character.data.ref);
  }

  /** Returns true if given character is in team */
  inTeam(characterRef: string): boolean {
    return !!this.list.find((c) => c.data.ref === characterRef);
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
        maxMaterias += character.weapon.data.maxMaterias;
      }
    });
    return maxMaterias;
  }

  /*
   * Refresh characters stats
   */
  refresh(): void {
    let bonusHpMax = 0;
    let bonusMpMax = 0;
    this.limitMax = 0;
    this.arrHits = [];

    this.attack = 0;
    let bonusAttack = 0;
    this.attackFromEquipment = 0;
    this.strengh = 0;

    this.defense = 0;
    let bonusDefense = 0;
    this.defenseFromEquipment = 0;
    this.vitality = 0;

    this.luck = 0;
    let bonusLuck = 0;
    this.luckFromEquipment = 0;

    this.speed = 0;
    let bonusSpeed = 0;
    this.speedFromEquipment = 0;

    this.list.forEach((character) => {
      bonusHpMax += character.data.stats.hp ?? 0;
      bonusMpMax += character.data.stats.mp ?? 0;
      bonusAttack += character.data.stats.attack ?? 0;
      bonusDefense += character.data.stats.defense ?? 0;
      bonusLuck += character.data.stats.luck ?? 0;
      bonusSpeed += character.data.stats.speed ?? 0;
      this.attackFromEquipment += character.getHits();
    });

    this.strengh = 6 * this.level;
    this.attack = addPercent(this.attackFromEquipment + this.strengh, bonusAttack);

    this.vitality = 6 * this.level;
    this.defense = addPercent(this.defenseFromEquipment + this.vitality, bonusDefense);

    this.luck = addPercent(this.luckFromEquipment + 6 * this.level, bonusLuck);
    this.speed = addPercent(this.speedFromEquipment + 6 * this.level, bonusSpeed);

    this.critHitRate = 3 + (this.luck / 100) * 4.7;
    this.critHitDamage = 100 + 4 * this.luck;

    this.hpMax = addPercent(4 * this.vitality, bonusHpMax);
    this.mpMax = addPercent(1 * this.vitality, bonusMpMax);
    this.limitMax = (2 * this.hpMax) / 3;
  }

  /** Updates only level */
  setLevel(level: number) {
    this.level = level;
  }

  /** Returns calculated XP MAX */
  getXpMax(): number {
    return 10 * (this.level + 1) ** 2;
  }

  /** Returns the percentage of XP progression */
  xpProgress(pixelsMax: number): number {
    return this.xp === 0 ? 0 : (this.xp / this.getXpMax()) * pixelsMax;
  }

  /** Updates xp and can trigger character level up */
  setXp(xp: number): void {
    if (this.level < 100) {
      this.xp += xp;
      while (this.xp >= this.getXpMax()) {
        this.xp -= this.getXpMax();
        this.level += 1;
      }
    } else {
      this.xp = 0;
    }
  }

  /**
   * Get total characters hits
   */
  getAttackSkill(): ItActionAttack {
    const { attackFromEquipment: hits } = this;
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
      level: this.level,
      xp: this.xp,
      list: [],
      hp: this.hp,
      mp: this.mp,
      limit: this.limit,
    };

    res.list = [];
    this.list.forEach((c) => {
      res.list.push(c.data.ref);
    });

    return res;
  }
}
