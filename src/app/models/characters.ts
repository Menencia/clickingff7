import { GameService } from '../game.service';
import { Attack } from './attack';
import { Character } from './character';
import { CharactersSave } from './save';

// maximum characters in the team
export const MAX_TEAM = 3;

export class Characters {

  list: Character[];
  arrHits: number[];
  selected: null|Character;
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

  constructor(public game: GameService) {

    // list of characters
    this.list = [];

    // Array of recent hits
    this.arrHits = [];

    // current selected character in menus
    this.selected = null;

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
  addHp(hp: number): void {
    this.hp += hp;
    if (this.hp > this.hpMax) {
      this.hp = this.hpMax;
    }
  }

  /**
   *
   */
  addMp(mp: number): void {
    this.mp += mp;
    if (this.mp > this.mpMax) {
      this.mp = this.mpMax;
    }
  }

  /**
   * Add a character
   */
  add(character: Character, inTeam: boolean): void {
    character.inTeam = (character.canJoinTeam()) ? inTeam : false;
    this.list.push(character);
  }

  /**
   * Returns the in-team characters
   */
  getTeam(): Character[] {
    return this.list.filter(e => e.inTeam && !e.isNotAvailable);
  }

  /**
   * Returns the backup (not in team) characters
   */
  getBackup(): Character[] {
    return this.list.filter(e => !e.inTeam && !e.isNotAvailable);
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
    let maxMaterias = 0;

    const characters = this.getTeam();
    for (const character of characters) {
      // Level
      if (character.level > this.levelMax) {
          this.levelMax = character.level;
      }

      // HP, hits
      this.hpMax += character.getHpMax();
      this.mpMax += character.getMpMax();
      this.hits += character.getHits();

      // max materias
      const weapon = character.weapon();
      if (weapon) {
        maxMaterias += weapon.maxMaterias;
      }

      this.levelSum += character.level;
    }

    this.limitMax = 2 * this.hpMax / 3;

    if (!this.hp || this.hp > this.hpMax) {
      this.hp = this.hpMax;
    }
    if (!this.mp || this.mp > this.mpMax) {
      this.mp = this.mpMax;
    }
    if (!this.limit) {
      this.limit = 0;
    }
    if (this.limit > this.limitMax) {
      this.limit = this.limitMax;
    }

    const materias = this.game.materias.getEquipped();
    if (materias.length > maxMaterias) {
      let equipped = true;
      for (const [i, m] of materias.entries()) {
        if (i < maxMaterias) {
          equipped = false;
        }
        m.equipped = equipped;
      }
    }
  }

  /**
   * Remove characters from the team if not available
   */
  available(): void {
    for (const c of this.list) {
      if (c.notAvailable()) {
        c.isNotAvailable = true;
        c.inTeam = false;
      } else {
        c.isNotAvailable = false;
      }
    }
  }

  /**
   * Select a character in menus
   */
  select(character: null|Character = null): void {
    if (!character) {
      character = this.getTeam()[0];
    }
    this.selected = character;
  }

  /**
   * Get total characters hits
   */
  getHits(): number {
    let hits = this.hits;

    // limit
    if (this.canLimit()) {
      hits *= 5;
      this.limit = 0;
    }

    return hits;
  }

  /**
   * Get total characters auto hits
   */
  displayAutoHits(hits: number): void {
    this.arrHits.unshift(hits);
    if (this.arrHits.length > 5) {
      this.arrHits.pop();
    }
    // this.game.$rootScope.$apply();
  }

  /**
   * Get total characters hits
   */
  displayHits(hits: number): void {
    this.arrHits.unshift(hits);
    if (this.arrHits.length > 5) {
      this.arrHits.pop();
    }
  }

  /**
   * Returns in pixels characters hp bar width
   */
  hpProgress(pixelsMax: number): number {
    return this.hp / this.hpMax * pixelsMax;
  }

  /**
   * Returns in pixels characters mp bar width
   */
  mpProgress(pixelsMax: number): number {
    return this.mp / this.mpMax * pixelsMax;
  }

  /**
   * Returns in pixels characters hp bar width
   */
  limitProgress(pixelsMax: number): number {
    return this.limit / this.limitMax * pixelsMax;
  }

  /**
   * Enemies are under attack
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
    this.game.enemies.displayAutoHits(hits);

    this.limit += hits;
    if (this.limit > this.limitMax) {
      this.limit = this.limitMax;
    }

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
      i++;
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
      i++;
    }
    return res;
  }

  /**
   * Escape from fight
   */
  escape(): void {
    this.game.battle.end(false);
  }

  /**
   * Returns if it is possible to attack
   */
  canAttack(): boolean {
    return (this.game.battle.isBattle);
  }

  /**
   * Returns if it is possible to execute a limit (powerful attack)
   */
  canLimit(): boolean {
    return (this.game.battle.isBattle && this.limit === this.limitMax);
  }

  /**
   * Returns if it is possible to escape from enemy
   */
  canEscape(): boolean {
    return (this.game.battle.isBattle);
  }

  /**
   * Returns data for export
   */
  export(): CharactersSave {
    const res: CharactersSave = {
      hp   : this.hp,
      mp   : this.mp,
      limit: this.limit,
      list: []
    };

    res.list = [];
    for (const c of this.list) {
      res.list.push(c.export());
    }

    return res;
  }

}
