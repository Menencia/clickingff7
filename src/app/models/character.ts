import { GameService } from '../game.service';
import { Weapon } from './weapon';
import { MAX_TEAM } from './characters';
import { CharacterSave } from './save';

export class Character {

  ref: string;
  level: number;
  xp: number;
  notA: number[];
  isNotAvailable: boolean;
  weaponType: string;
  hpBase: number;
  mpBase: number;
  xpBase: number;
  inTeam: boolean;
  image: string;
  name: string;

  constructor(public game: GameService) {
    this.ref = this.constructor.name;
    this.level = 1;
    this.xp = 0;
    this.notA = [];
    this.isNotAvailable = false;
    this.weaponType = '';
    this.hpBase = 0;
    this.mpBase = 0;
    this.xpBase = 0;
    this.inTeam = false;
    this.image = '';
    this.name = '';
  }

  /**
   * Extends
   */
  load(data: CharacterSave): Character {
    Object.assign({}, this, data);
    return this;
  }

  /**
   * Returns true if the character is available in the levelMax
   */
  notAvailable(): boolean {
    const t = this.notA;
    for (const i of t) {
      if (i === this.game.zones.levelMax) {
        return true;
      }
    }
    return false;
  }

  /*
  *
  */
  weapon(): Weapon | undefined {
    return this.game.weapons.list.find((w: Weapon) => {
      return w.type === this.weaponType && w.equipped === true;
    });
  }

  /**
   * Returns unequipped weapons
   */
  getOthersWeapons(): Weapon[] {
    return this.game.weapons.list.filter((w: Weapon) => {
      return (w.type === this.weaponType && w.name !== this.weapon()?.name);
    });
  }

  /**
   * Select the character in the menus
   */
  select(): void {
    this.game.characters.select(this);
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
    const weapon = this.weapon();
    if (weapon) {
      return this.level * weapon.hits / 10;
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

        this.game.characters.refresh();
      }
    } else {
      this.xp = 0;
    }
  }

  /**
   * Returns true if character can join team
   */
  canJoinTeam(): boolean {
    return this.game.characters.getTeam().length < MAX_TEAM;
  }

  /**
   * Character joins the team
   */
  joinTeam(): void {
    if (this.canJoinTeam()) {
      this.inTeam = true;
      this.game.characters.refresh();
    }
  }

  /**
   * Returns true if the character can leave the team
   */
  canLeaveTeam(): boolean {
    return this.game.characters.getTeam().length > 1;
  }

  /**
   * Character leaves the team
   */
  leaveTeam(): void {
    if (this.canLeaveTeam()) {
      this.inTeam = false;
      this.game.characters.refresh();
    }
  }

  /**
   *
   */
  getLine(): string {
    const levelMax = this.game.zones.levelMax;
    return 'Line ' + levelMax + ' ' + this.constructor.name;
  }

  /**
   *
   */
  export(): CharacterSave {
    const {ref, inTeam, level, xp} = this;
    return {ref, inTeam, level, xp};
  }

}
