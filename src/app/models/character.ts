import { CharacterRef } from './refs/characters';
import { CharacterSave } from './save';
import { Weapon } from './weapon';

interface CharacterBase {
  ref: CharacterRef;
  image: string;
  weaponType: string;
  hp: number;
  mp: number;
  xp: number;
  notA?: number[];
}

export interface CharacterJson extends CharacterBase {
  weapon: string;
}

export interface CharacterData extends CharacterBase {
  weapon: Weapon;
}

export class Character {
  level = 1;

  xp = 0;

  ref: CharacterRef;

  image: string;

  weaponType: string;

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

  /** Updates all CharacterSave data except weapon */
  load(data: CharacterSave): Character {
    this.level = data.level;
    this.xp = data.xp;
    this.image = data.image;
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

  /* Returns true if the character is available in the {zonelevelMax} */
  notAvailable(zonelevelMax: number): boolean {
    return this.notA.includes(zonelevelMax);
  }

  /* Returns calculated HP MAX */
  getHpMax(): number {
    return Math.ceil((((this.hpBase - 3) * 10) / 100 + 1) * 20 * this.level);
  }

  /** Returns calculated MP MAX */
  getMpMax(): number {
    return Math.ceil((((this.mpBase - 3) * 10) / 100 + 1) * 3 * this.level);
  }

  /** Returns calculated XP MAX */
  getXpMax(): number {
    return Math.ceil((((3 - this.xpBase) * 10) / 100 + 1) * 100 * this.level);
  }

  /** Returns hits produced by current weapon */
  getHits(): number {
    if (this.weapon) {
      return (this.level * this.weapon.hits) / 10;
    }
    return 0;
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

  /** Returns Character data to be saved */
  export(): CharacterSave {
    const { ref, level, xp, image, weapon } = this;
    const weaponRef = weapon.ref;
    return { ref, level, xp, image, weaponRef };
  }
}
