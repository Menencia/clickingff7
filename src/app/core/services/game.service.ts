import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import packageJson from '../../../../package.json';
import { Character } from '../../models/character';
import { Items } from '../../models/items';
import { Materias } from '../../models/materias';
import { CharacterRef } from '../../models/refs/characters';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { Save } from '../../models/save';
import { Characters } from '../../models/units/characters';
import { Weapon } from '../../models/weapon';
import { Weapons } from '../../models/weapons';
import { Zones } from '../../models/zones';
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

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private translate = inject(TranslateService);
  private store = inject(StoreService);

  /** time counter */
  timer: number;

  /** List of saves */
  saves: Save[] = [];

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
      this.saves.push(save);
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
    this.characters.select();

    this.autoTimer();
  }

  /*
   * Basic inventory
   */
  buildLevel(level: number): void {
    // build zone
    this.zones.add(this.store.getZone(`zone${level}` as ZoneRef));

    const zonelevelMax = this.zones.levelMax;
    this.characters.available(zonelevelMax);

    // data to load characters
    const levelMax = this.characters.levelMax() || 1;

    switch (level) {
      case 1:
        // add cloud in the team
        this.characters.add(
          this.store.getCharacter(CharacterRef.Cloud).setLevel(levelMax),
          true,
        );
        this.weapons.add(this.store.getWeapon(WeaponRef.BusterSword), true);

        // add barret in the team
        this.characters.add(
          this.store.getCharacter(CharacterRef.Barret).setLevel(levelMax),
          true,
        );
        this.weapons.add(this.store.getWeapon(WeaponRef.GatlingGun), true);

        // add materias
        this.materias.add(this.store.getMateria(MateriaRef.Restore), true);
        this.materias.add(this.store.getMateria(MateriaRef.Bolt), true);

        // add items
        this.items.add(this.store.getItem(ItemRef.Potion), true);
        this.items.add(this.store.getItem(ItemRef.Potion), true);

        break;
      case 2:
        // add tifa in the team
        this.characters.add(
          this.store.getCharacter(CharacterRef.Tifa).setLevel(levelMax),
          true,
        );
        this.weapons.add(this.store.getWeapon(WeaponRef.LeatherGlove), true);
        break;
      case 3:
        // add aerith in the team
        this.characters.add(
          this.store.getCharacter(CharacterRef.Aerith).setLevel(levelMax),
          true,
        );
        this.weapons.add(this.store.getWeapon(WeaponRef.GuardStick), true);
        break;
      case 4:
        // add barret & tifa in the team
        this.characters.list.forEach((c) => {
          if (c.ref === CharacterRef.Barret || c.ref === CharacterRef.Tifa) {
            c.inTeam = true;
          }
        });
        break;
      case 5:
        // add redxiii in the team
        this.characters.add(
          this.store.getCharacter(CharacterRef.RedXIII).setLevel(levelMax),
          false,
        );
        this.weapons.add(this.store.getWeapon(WeaponRef.MythrilClip), true);
        break;
      case 9:
        // add yuffie in the team
        this.characters.add(
          this.store.getCharacter(CharacterRef.Yuffie).setLevel(levelMax),
          false,
        );
        this.weapons.add(this.store.getWeapon(WeaponRef.FPtShuriken), true);
        break;
      default:
      // do nothing
    }

    this.linkWeapons();

    // restore hp & mp
    this.characters.refresh();
    this.characters.hp.set(this.characters.hpMax());
    this.characters.mp.set(this.characters.mpMax());
    this.characters.limit.set(0);
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
    return weapon.type === character.weaponType && !weapon.equipped;
  }

  /**
   * The character wields the weapon, the previous weapon of the same type is
   * unequipped and the team stats are recomputed. Does nothing if the weapon
   * cannot be equipped.
   */
  equipWeapon(character: Character, weapon: Weapon): void {
    if (!this.canEquipWeapon(character, weapon)) {
      return;
    }
    this.weapons.list
      .filter((w) => w.type === weapon.type && w.equipped)
      .forEach((w) => {
        w.equipped = false;
      });
    weapon.equipped = true;
    character.setWeapon(weapon);
    this.characters.refresh();
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
      weapons: this.weapons.export(),
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
  load(save: Save, confirm = true): void {
    if (!confirm) {
      return;
    }

    // weapons
    save.weapons.forEach((w) => {
      const weapon = this.store.getWeapon(w.ref).load(w);
      this.weapons.add(weapon, w.equipped);
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

    this.language = save.language;
    // Older saves store the difficulty as a string ("2").
    this.difficulty = Number(save.difficulty);

    this.time.set(save.time);
    this.gils.set(save.gils);
  }

  /**
   *
   */
  save(confirm = true): void {
    if (!confirm) {
      return;
    }

    const s = this.export();
    this.saves[0] = s;

    localStorage[SAVE_1] = encodeSave(s);
  }

  /**
   * Remove the COOKIE & reset the game
   */
  reset(): void {
    this.saves = [];

    localStorage.removeItem(SAVE_1);
  }
}
