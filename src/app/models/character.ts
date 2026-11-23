import {
  inverseStatFactor,
  MAX_LEVEL,
  statFactor,
} from '../shared/utils/game.utils';
import { percent } from '../shared/utils/math.utils';
import { CharacterRef } from './refs/characters';
import { WeaponRef } from './refs/weapons';
import { CharacterSave } from './save';
import { Weapon } from './weapon';
import { WeaponType } from './weapon-type';

interface CharacterBase {
  ref: CharacterRef;
  image: string;
  weaponType: WeaponType;
  hp: number;
  mp: number;
  xp: number;
  notA?: number[];
}

export interface CharacterJson extends CharacterBase {
  weapon: WeaponRef;
}

export interface CharacterData extends CharacterBase {
  weapon: Weapon;
}

export class Character {
  level = 1;

  xp = 0;

  isNotAvailable = false;

  inTeam = false;

  ref: CharacterRef;

  image: string;

  weaponType: WeaponType;

  weapon: Weapon;

  hpBase: number;

  mpBase: number;

  xpBase: number;

  notA: number[];

  constructor(data: CharacterData) {
    this.ref = data.ref;
    this.image = data.image;
    this.weaponType = data.weaponType;
    this.weapon = data.weapon;
    this.hpBase = data.hp;
    this.mpBase = data.mp;
    this.xpBase = data.xp;
    this.notA = data.notA ?? [];
  }

  /**
   * Updates all CharacterSave data except weapon.
   * `image` is ignored: the portrait always comes from the catalog.
   */
  load(data: CharacterSave): Character {
    this.level = data.level;
    this.xp = data.xp;
    this.inTeam = data.inTeam;
    return this;
  }

  /** Updates only weapon */
  setWeapon(weapon: Weapon) {
    this.weapon = weapon;
  }

  /** Updates only level */
  setLevel(level: number): Character {
    this.level = level;
    return this;
  }

  /** Returns true if the character is not available in the {zonelevelMax} */
  notAvailable(zonelevelMax: number): boolean {
    return this.notA.includes(zonelevelMax);
  }

  /* Returns calculated HP MAX */
  getHpMax(): number {
    return Math.ceil(statFactor(this.hpBase) * 20 * this.level);
  }

  /** Returns calculated MP MAX */
  getMpMax(): number {
    return Math.ceil(statFactor(this.mpBase) * 3 * this.level);
  }

  /** Returns calculated XP MAX */
  getXpMax(): number {
    return Math.ceil(inverseStatFactor(this.xpBase) * 100 * this.level);
  }

  /** Returns hits produced by current weapon */
  getHits(): number {
    if (this.weapon) {
      return (this.level * this.weapon.hits) / 10;
    }
    return 0;
  }

  /** Returns the percentage of XP progression */
  xpProgress(): number {
    return percent(this.xp, this.getXpMax());
  }

  /** Updates xp and can trigger character level up */
  setXp(xp: number): void {
    this.xp += xp;
    while (this.level < MAX_LEVEL && this.xp >= this.getXpMax()) {
      this.xp -= this.getXpMax();
      this.level += 1;
    }
    if (this.level >= MAX_LEVEL) {
      this.xp = 0;
    }
  }

  /** Returns Character data to be saved */
  export(): CharacterSave {
    const { ref, inTeam, level, xp, image, weapon } = this;
    const weaponRef = weapon.ref;
    return { ref, inTeam, level, xp, image, weaponRef };
  }
}
