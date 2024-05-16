import { CharacterRef } from './refs/characters';
import { CharacterSave } from './save';
import { Weapon } from './weapon';

interface CharacterBase {
  ref: CharacterRef;
  image: string;
  weaponType: string;
  stats: BonusStats;
  zoneOff?: number[];
}

interface BonusStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  luck: number;
  speed: number;
}

export interface CharacterJson extends CharacterBase {
  weapon: string;
}

export interface CharacterData extends CharacterBase {
  weapon: Weapon;
}

export class Character {
  ref: CharacterRef;

  image: string;

  weaponType: string;

  weapon: Weapon;

  bonusStats: BonusStats;

  zoneOff: number[];

  constructor(data: CharacterData) {
    this.ref = data.ref;
    this.image = data.image;
    this.weaponType = data.weaponType;
    this.weapon = data.weapon;
    this.bonusStats = data.stats;
    this.zoneOff = data.zoneOff ?? [];
  }

  /** Updates all CharacterSave data except weapon */
  load(data: CharacterSave): Character {
    this.image = data.image;
    return this;
  }

  /** Updates only weapon */
  setWeapon(weapon: Weapon) {
    this.weapon = weapon;
  }

  /* Returns true if the character is available in the {zonelevelMax} */
  notAvailable(zonelevelMax: number): boolean {
    return this.zoneOff.includes(zonelevelMax);
  }

  /** Returns hits produced by current weapon */
  getHits(): number {
    if (this.weapon) {
      return this.weapon.hits;
    }
    return 0;
  }

  /** Returns Character data to be saved */
  export(): CharacterSave {
    const { ref, image, weapon } = this;
    const weaponRef = weapon.ref;
    return { ref, image, weaponRef };
  }
}
