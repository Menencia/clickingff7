import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import packageJson from '../../../../package.json';
import { Character } from '../../models/character';
import { Items } from '../../models/items';
import { Materias } from '../../models/materias';
import { ZoneRef } from '../../models/refs/zones';
import { Save } from '../../models/save';
import { Characters } from '../../models/units/characters';
import { Weapon } from '../../models/weapon';
import { Weapons } from '../../models/weapons';
import { ZONE_UNLOCKS } from '../../models/zone-unlocks';
import { MAX_ZONES, Zones } from '../../models/zones';
import { decodeSave, encodeSave } from '../../shared/utils/save.utils';
import { isVersionAtLeast } from '../../shared/utils/version.utils';
import { StoreService } from './store.service';

const SAVE_1 = 'save1';
const CURRENT_VERSION = packageJson.version;
const BASE_GILS = 200;

export enum Difficulty {
  Easy = 1,
  Normal = 2,
  Hard = 3,
}

const DIFFICULTIES = [Difficulty.Easy, Difficulty.Normal, Difficulty.Hard];

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private translate = inject(TranslateService);
  private store = inject(StoreService);

  /** time counter */
  timer: number;

  /** Last save written to or read from the storage, if any */
  readonly lastSave = signal<Save | undefined>(undefined);

  /**
   * Save settings
   */
  characters = new Characters();

  zones = new Zones();

  weapons = new Weapons();

  materias = new Materias();

  items = new Items();

  readonly gils = signal(BASE_GILS);

  language = 'en';

  difficulty = Difficulty.Normal;

  readonly time = signal(0);

  version = CURRENT_VERSION;

  /**
   * init
   */
  constructor() {
    // timer
    this.timer = 0;

    // language
    this.language = this.getLanguage(this.translate.getBrowserLang());
  }

  getLanguage(language: string | undefined, defaultLanguage = 'en'): string {
    const languages = ['en', 'fr', 'es'];
    return languages.find((l) => l === language) || defaultLanguage;
  }

  /**
   * Starts the game from the stored save, or a new game if there is none.
   * Called once by the app initializer, after the game data is loaded.
   */
  run(): void {
    this.preload();

    // search for save
    const s = localStorage[SAVE_1];
    const save = s ? decodeSave(s) : null;

    if (save && isVersionAtLeast(save.version, '1.1.0') && this.tryLoad(save)) {
      this.lastSave.set(save);
      this.postload();
    } else {
      // no save, corrupted, too old or unloadable: new game
      this.newGame();
    }
  }

  /**
   * Erases the stored save and starts a new game in zone 1
   */
  newGame(): void {
    this.preload();
    this.reset();
    this.buildLevel(1);
    this.postload();
  }

  /**
   * Replaces the current game with a save, without writing it to storage.
   * If the save references unknown data, the current game is kept and
   * false is returned.
   */
  importGame(save: Save): boolean {
    const current = this.export();
    this.preload();
    if (!this.tryLoad(save)) {
      this.preload();
      this.load(current);
      this.postload();
      return false;
    }
    this.postload();
    return true;
  }

  /**
   * Load a save, returns false if it references unknown data
   */
  private tryLoad(save: Save): boolean {
    try {
      this.load(save);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Preload all savable variables
   */
  preload(): void {
    this.characters = new Characters();
    this.zones = new Zones();
    this.weapons = new Weapons();
    this.materias = new Materias();
    this.items = new Items();
    this.gils.set(BASE_GILS);
    this.language = this.getLanguage(this.translate.getBrowserLang());
    this.difficulty = Difficulty.Normal;
    this.time.set(0);
    this.version = CURRENT_VERSION;
  }

  /**
   * Refresh the game with data loaded
   */
  postload(): void {
    this.translate.use(this.language);

    this.characters.refresh();
    this.fitMaterias();
    this.characters.select();

    this.autoTimer();
  }

  /**
   * Adds the zone of this level and what it unlocks (see ZONE_UNLOCKS), then
   * restores the team's HP and MP
   */
  buildLevel(level: number): void {
    // build zone
    this.zones.add(this.store.getZone(`zone${level}` as ZoneRef));

    const zonelevelMax = this.zones.levelMax;
    this.characters.available(zonelevelMax);

    // new characters join at the highest team level
    const levelMax = this.characters.levelMax() || 1;
    const unlock = ZONE_UNLOCKS[level] ?? {};

    unlock.characters?.forEach(({ ref, inTeam }) => {
      this.characters.add(
        this.store.getCharacter(ref).setLevel(levelMax),
        inTeam,
      );
    });
    unlock.joinTeam?.forEach((ref) => {
      const character = this.characters.list.find((c) => c.ref === ref);
      if (character) {
        character.inTeam = true;
      }
    });
    unlock.weapons?.forEach((ref) => {
      this.weapons.add(this.store.getWeapon(ref));
    });
    unlock.materias?.forEach(({ ref, equipped }) => {
      this.materias.add(this.store.getMateria(ref), equipped);
    });
    unlock.items?.forEach(({ ref, equipped }) => {
      this.items.add(this.store.getItem(ref), equipped);
    });

    this.linkWeapons();

    // restore hp & mp
    this.characters.refresh();
    this.fitMaterias();
    this.characters.hp.set(this.characters.hpMax());
    this.characters.mp.set(this.characters.mpMax());
    this.characters.limit.set(0);
  }

  /**
   * Moves to the next zone, and builds and unlocks it if it is new. Does
   * nothing if the current zone is not completed or the last zone is reached.
   */
  goNextZone(): void {
    if (!this.zones.isNextZone()) {
      return;
    }
    const next = this.zones.level + 1;
    if (next > this.zones.levelMax) {
      this.zones.levelMax = next;
      this.buildLevel(next);
    }
    this.zones.goTo(next);
  }

  /**
   * Points each character to the owned weapon of the same ref, so that
   * equipping and selling act on the player's stock.
   */
  private linkWeapons(): void {
    this.characters.list.forEach((c) => {
      const owned = this.weapons.list.find((w) => w.ref === c.weapon.ref);
      if (owned) {
        c.setWeapon(owned);
      }
    });
  }

  /**
   * Returns true if the character can wield the weapon and it is not worn
   */
  canEquipWeapon(character: Character, weapon: Weapon): boolean {
    return (
      weapon.type === character.weaponType &&
      !this.weapons.isEquipped(weapon, this.characters.list)
    );
  }

  /**
   * The character wields the weapon instead of the previous one, and the team
   * stats are recomputed. Does nothing if the weapon cannot be equipped.
   */
  equipWeapon(character: Character, weapon: Weapon): void {
    if (!this.canEquipWeapon(character, weapon)) {
      return;
    }
    character.setWeapon(weapon);
    this.characters.refresh();
    this.fitMaterias();
  }

  /**
   * A character leaves the team, and the materias that no longer have a slot
   * are unequipped. Does nothing if it is the last one.
   */
  leaveTeam(character: Character): void {
    this.characters.leave(character);
    this.fitMaterias();
  }

  /**
   * Unequips the materias beyond the slots of the team's weapons
   */
  private fitMaterias(): void {
    this.materias.fit(this.characters.maxMaterias());
  }

  /**
   * Auto-chrono
   */
  autoTimer(): void {
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.time.update((time) => time + 1);
      this.autoTimer();
    }, 1000);
  }

  /**
   * Export the game
   */
  export(): Save {
    return {
      characters: this.characters.export(),
      zones: this.zones.export(),
      weapons: this.weapons.export(this.characters.list),
      materias: this.materias.export(),
      items: this.items.export(),
      gils: this.gils(),
      language: this.language,
      difficulty: this.difficulty,
      time: this.time(),
      version: this.version,
    };
  }

  /**
   * Load a save
   */
  load(save: Save): void {
    // weapons (w.equipped is ignored: characters hold the worn weapons)
    save.weapons.forEach((w) => {
      this.weapons.add(this.store.getWeapon(w.ref).load(w));
    });

    // characters
    save.characters.list.forEach((c) => {
      const character = this.store.getCharacter(c.ref).load(c);
      character.setWeapon(this.store.getWeapon(c.weaponRef));
      this.characters.add(character, c.inTeam);
    });
    this.linkWeapons();

    this.characters.hp.set(save.characters.hp);
    this.characters.mp.set(save.characters.mp);
    this.characters.limit.set(save.characters.limit);

    // zones
    save.zones.list.forEach((z) => {
      const zone = this.store.getZone(z.ref).load(z);
      this.zones.add(zone);
    });

    this.zones.level = save.zones.level;
    this.zones.levelMax = save.zones.levelMax;

    const zonelevelMax = this.zones.levelMax;
    this.characters.available(zonelevelMax);

    // materias
    save.materias.forEach((m) => {
      const materia = this.store.getMateria(m.ref).load(m);
      this.materias.add(materia, m.equipped);
    });

    // items
    save.items.forEach((i) => {
      const item = this.store.getItem(i.ref).load(i);
      this.items.add(item, i.equipped);
    });
    this.items.fit();

    this.language = save.language;
    // Older saves store the difficulty as a string ("2").
    this.difficulty = Number(save.difficulty);

    this.time.set(save.time);
    this.gils.set(save.gils);

    this.checkPlayable();
  }

  /**
   * Throws if the loaded game cannot be played: current zone or last
   * unlocked zone missing, empty team or unknown difficulty. Completes the
   * shape checks of decodeSave(), which cannot see the game data.
   */
  private checkPlayable(): void {
    const { level, levelMax, list } = this.zones;
    const lastZone = Math.max(0, ...list.map((z) => z.level));
    if (level > levelMax || levelMax > MAX_ZONES || levelMax > lastZone) {
      throw new Error('Invalid zone progress');
    }
    this.zones.current();

    if (this.characters.getTeam().length === 0) {
      throw new Error('Empty team');
    }

    if (!DIFFICULTIES.includes(this.difficulty)) {
      throw new Error('Unknown difficulty');
    }
  }

  /**
   * Write the current game to localStorage.
   * Returns false if the storage refuses it (quota, storage disabled), in which
   * case the last save is left unchanged.
   */
  save(): boolean {
    const s = this.export();
    try {
      localStorage.setItem(SAVE_1, encodeSave(s));
    } catch {
      return false;
    }
    this.lastSave.set(s);
    return true;
  }

  /**
   * Remove the COOKIE & reset the game
   */
  reset(): void {
    this.lastSave.set(undefined);

    localStorage.removeItem(SAVE_1);
  }
}
