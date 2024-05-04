import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Items } from 'src/app/models/items';
import { Materias } from 'src/app/models/materias';
import { CharacterRef } from 'src/app/models/refs/characters';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { ZoneRef } from 'src/app/models/refs/zones';
import { Save } from 'src/app/models/save';
import { Characters } from 'src/app/models/units/characters';
import { Weapons } from 'src/app/models/weapons';
import { Zones } from 'src/app/models/zones';
import { compareVersions } from 'src/app/shared/utils/version.utils';

import packageJson from '../../../../package.json';

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
  /** time counter */
  timer: number;

  /** List of saves */
  saves: Save[] = [];

  /** Last export */
  lastExport = '';

  /**
   * Save settings
   */
  characters = new Characters();

  zones = new Zones();

  weapons = new Weapons();

  materias = new Materias();

  items = new Items();

  gils = BASE_GILS;

  language = this.getLanguage(this.translate.getBrowserLang());

  difficulty = Difficulty.Normal;

  time = 0;

  version = CURRENT_VERSION;

  /**
   * init
   */
  constructor(
    private translate: TranslateService,
    private store: StoreService,
  ) {
    // timer
    this.timer = 0;

    // load all resources
    this.run();
  }

  getLanguage(language: string | undefined, defaultLanguage = 'en'): string {
    const languages = ['en', 'fr', 'es'];
    return languages.find((l) => l === language) || defaultLanguage;
  }

  run(): void {
    // PRELOAD
    this.preload();

    // search for save
    let save;
    const s = localStorage[SAVE_1];
    if (s) {
      save = JSON.parse(atob(s));
      if (save) {
        if (compareVersions(save.version, '1.4.0')) {
          this.saves.push(save);
        } else {
          save = null;
          this.reset();
        }
      }
    }

    // load save
    if (save) {
      this.load(save);
      this.zones.checkLastZone();
    } else {
      this.reset();
      this.buildLevel(1);
    }

    // POSTLOAD
    this.postload();
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
    this.gils = BASE_GILS;
    this.language = this.getLanguage(this.translate.getBrowserLang());
    this.difficulty = Difficulty.Normal;
    this.time = 0;
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
    const levelMax = this.characters.levelMax ? this.characters.levelMax : 1;

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

    // restore hp & mp
    this.characters.refresh();
    this.characters.hp = this.characters.hpMax;
    this.characters.mp = this.characters.mpMax;
    this.characters.limit = 0;
  }

  /**
   * Auto-chrono
   */
  autoTimer(): void {
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.time += 1;
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
      gils: this.gils,
      language: this.language,
      difficulty: this.difficulty,
      time: this.time,
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

    // characters
    save.characters.list.forEach((c) => {
      const character = this.store.getCharacter(c.ref).load(c);
      character.setWeapon(this.store.getWeapon(c.weaponRef));
      this.characters.add(character, c.inTeam);
    });

    this.characters.hp = save.characters.hp;
    this.characters.mp = save.characters.mp;
    this.characters.limit = save.characters.limit;

    // zones
    save.zones.list.forEach((z) => {
      const zone = this.store.getZone(z.ref).load(z);
      this.zones.add(zone);
    });

    this.zones.level = save.zones.level;
    this.zones.levelMax = save.zones.levelMax;

    const zonelevelMax = this.zones.levelMax;
    this.characters.available(zonelevelMax);

    // weapons
    save.weapons.forEach((w) => {
      const weapon = this.store.getWeapon(w.ref).load(w);
      this.weapons.add(weapon, w.equipped);
    });

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
    this.difficulty = save.difficulty;

    this.time = save.time;
    this.gils = save.gils;
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

    const ss = btoa(JSON.stringify(s));
    localStorage[SAVE_1] = ss;
    this.lastExport = ss;
  }

  /**
   * Remove the COOKIE & reset the game
   */
  reset(): void {
    this.saves = [];

    localStorage.removeItem(SAVE_1);
  }
}
