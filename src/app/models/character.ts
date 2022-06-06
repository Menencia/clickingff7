import { Weapon } from './weapon';
import { CharacterSave } from './save';
import { CharacterRef } from './refs/characters';
import { WeaponLoader } from './loaders/weapon-loader';

export abstract class Character {

  abstract ref: CharacterRef;
  level: number;
  xp: number;
  isNotAvailable: boolean;
  inTeam: boolean;

  abstract name: string;
  abstract image: string;
  abstract weaponType: string;
  abstract weapon: Weapon;
  abstract hpBase: number;
  abstract mpBase: number;
  abstract xpBase: number;
  abstract notA: number[];

  constructor() {
    this.level = 1;
    this.xp = 0;
    this.isNotAvailable = false;
    this.inTeam = false;
  }

  /**
   * Extends
   */
  load(data: CharacterSave): Character {
    this.ref = data.ref;
    this.level = data.level;
    this.xp = data.xp;
    this.inTeam = data.inTeam;
    this.image = data.image;
    this.weapon = WeaponLoader.build(data.weaponRef);
    return this;
  }

  /**
   * Set current level
   */
  setLevel(level: number): Character {
    this.level = level;
    return this;
  }

  /**
   * Returns true if the character is available in the levelMax
   */
  notAvailable(zonelevelMax: number): boolean {
    const t = this.notA;
    for (const i of t) {
      if (i === zonelevelMax) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   */
  getHpMax(): number {
    return Math.ceil(((this.hpBase - 3) * 10 / 100 + 1) * 20 * this.level);
  }

  /**
   *
   */
  getMpMax(): number {
    return Math.ceil(((this.mpBase - 3) * 10 / 100 + 1) * 3 * this.level);
  }

  /**
   *
   */
  getXpMax(): number {
    return Math.ceil(((3 - this.xpBase) * 10 / 100 + 1) * 100 * this.level);
  }

  /**
   *
   */
  getHits(): number {
    if (this.weapon) {
      return this.level * this.weapon.hits / 10;
    }
    return 0;
  }

  /**
   *
   */
  xpProgress(pixelsMax: number): number {
    return (this.xp === 0 ? 0 : this.xp / this.getXpMax() * pixelsMax);
  }

  /**
   *
   */
  setXp(xp: number): void {
    if (this.level < 100) {
      this.xp += xp;
      while (this.xp >= this.getXpMax()) {
        this.xp -= this.getXpMax();
        this.level++;
      }
    } else {
      this.xp = 0;
    }
  }

  /**
   *
   */
  export(): CharacterSave {
    const {ref, inTeam, level, xp, image, weapon} = this;
    const weaponRef = weapon.ref;
    return {ref, inTeam, level, xp, image, weaponRef};
  }

}
