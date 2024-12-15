import { CharacterRef } from './refs/characters';
import { WeaponRef } from './refs/weapons';
import { CharacterSave } from './save';
import { Weapon } from './weapon';

export interface CharacterJson {
  ref: CharacterRef;
  image: string;
  weaponType: string;
  weapon: WeaponRef;
  stats: Partial<BonusStats>;
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

export class Character {
  constructor(
    public readonly data: Readonly<CharacterJson>,
    public weapon: Weapon,
  ) {}

  /** Updates only weapon */
  setWeapon(weapon: Weapon) {
    this.weapon = weapon;
  }

  /* Returns true if the character is available in the {zonelevelMax} */
  notAvailable(zonelevelMax: number): boolean {
    return (this.data.zoneOff ?? []).includes(zonelevelMax);
  }

  /** Returns hits produced by current weapon */
  getHits(): number {
    if (this.weapon) {
      return this.weapon.data.hits;
    }
    return 0;
  }

  /** Returns Character data to be saved */
  export(): CharacterSave {
    const { weapon } = this;
    const weaponRef = weapon.data.ref;
    return { ref: this.data.ref, weaponRef };
  }
}
