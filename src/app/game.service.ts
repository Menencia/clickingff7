import { Injectable } from '@angular/core';
import { Battle } from './models/battle';
import { Characters } from './models/characters';
import { Enemies } from './models/enemies';
import { Items } from './models/items';
import { Materias } from './models/materias';
import { Save } from './models/save';
import { Shop } from './models/shop';
import { Weapons } from './models/weapons';
import { Zones } from './models/zones';
import * as compareVersions from 'compare-versions';
import { TranslateService } from '@ngx-translate/core';
import { ZoneLoader } from './models/loaders/zone-loader';
import { CharacterLoader } from './models/loaders/character-loader';
import { WeaponLoader } from './models/loaders/weapon-loader';
import { ItemLoader } from './models/loaders/item-loader';
import { MateriaLoader } from './models/loaders/materia-loader';
import { CharacterRef } from './models/refs/characters';
import { WeaponRef } from './models/refs/weapons';
import { ItemRef } from './models/refs/items';
import { MateriaRef } from './models/refs/materias';

const SAVE_1 = 'save1';
const CURRENT_VERSION = '1.1.3-beta.2';
const BASE_GILS = 200;

enum Difficulty {
  Easy = 1,
  Normal = 2,
  Hard = 3
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  /** time counter */
  timer: number;

  /** battle module */
  battle: Battle;

  /** shop module */
  shop: Shop;

  /** Enemies module */
  enemies: Enemies;

  /** List of saves */
  saves: Save[] = [];

  /** Last export */
  lastExport = '';

  /**
   * Save settings
   */
  characters = new Characters(this);
  zones = new Zones(this);
  weapons = new Weapons(this);
  materias = new Materias(this);
  items = new Items(this);
  gils = BASE_GILS;
  language = this.getLanguage(this.translate.getBrowserLang());
  difficulty = Difficulty.Normal;
  time = 0;
  version = CURRENT_VERSION;

  /**
   * init
   */
  constructor(public translate: TranslateService) {
    // timer
    this.timer = 0;

    // temp models
    this.battle = new Battle(this);
    this.shop = new Shop(this);
    this.enemies = new Enemies(this);

    // load all resources
    this.run();
  }

  getLanguage(language: string, def = 'en'): string {
    const languages = ['en', 'fr', 'es'];
    for (const l of languages) {
      if (l === language) {
        return language;
      }
    }
    return def;
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
        if (compareVersions(save.version, '1.1.0') >= 0) {
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
    this.characters = new Characters(this);
    this.zones = new Zones(this);
    this.weapons = new Weapons(this);
    this.materias = new Materias(this);
    this.items = new Items(this);
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

    this.shop.refresh();

    this.characters.refresh();
    this.characters.select();

    this.autoTimer();
  }

  /*
    * Basic inventory
    */
  buildLevel(level: number): void {
    // build zone
    const z = ZoneLoader.buildByLevel(level, this);
    this.zones.add(z);

    this.characters.available();

    // data to load characters
    const levelMax = this.characters.levelMax ? this.characters.levelMax : 1;

    switch (level) {
      case 1:
        // add cloud in the team
        this.characters.add(CharacterLoader.build(CharacterRef.Cloud, this).setLevel(levelMax), true);
        this.weapons.add(WeaponLoader.build(WeaponRef.BusterSword, this), true);

        // add barret in the team
        this.characters.add(CharacterLoader.build(CharacterRef.Barret, this).setLevel(levelMax), true);
        this.weapons.add(WeaponLoader.build(WeaponRef.GatlingGun, this), true);

        // add materias
        this.materias.add(MateriaLoader.build(MateriaRef.Restore, this), true);
        this.materias.add(MateriaLoader.build(MateriaRef.Bolt, this), true);

        // add items
        this.items.add(ItemLoader.build(ItemRef.Potion, this), true);
        this.items.add(ItemLoader.build(ItemRef.Potion, this), true);

        break;
      case 2:
        // add tifa in the team
        this.characters.add(CharacterLoader.build(CharacterRef.Tifa, this).setLevel(levelMax), true);
        this.weapons.add(WeaponLoader.build(WeaponRef.LeatherGlove, this), true);
        break;
      case 3:
        // add aerith in the team
        this.characters.add(CharacterLoader.build(CharacterRef.Aerith, this).setLevel(levelMax), true);
        this.weapons.add(WeaponLoader.build(WeaponRef.GuardStick, this), true);
        break;
      case 4:
        // add barret & tifa in the team
        for (const c of this.characters.list) {
          if (c.ref === CharacterRef.Barret || c.ref === CharacterRef.Tifa) {
            c.inTeam = true;
          }
        }
        break;
      case 5:
        // add redxiii in the team
        this.characters.add(CharacterLoader.build(CharacterRef.RedXIII, this).setLevel(levelMax), true);
        this.weapons.add(WeaponLoader.build(WeaponRef.MythrilClip, this), true);
        break;
      case 9:
        // add yuffie in the team
        this.characters.add(CharacterLoader.build(CharacterRef.Yuffie, this).setLevel(levelMax), true);
        this.weapons.add(WeaponLoader.build(WeaponRef.FPtShuriken, this), true);
        break;
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
      this.time++;
      this.autoTimer();
    }, 1000);
  }

  /**
   * Export the game
   */
  export(): Save {
    return {
      characters: this.characters.export(),
      zones     : this.zones.export(),
      weapons   : this.weapons.export(),
      materias  : this.materias.export(),
      items     : this.items.export(),
      gils      : this.gils,
      language  : this.language,
      difficulty: this.difficulty,
      time      : this.time,
      version   : this.version
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
    for (const c of save.characters.list) {
      const character = CharacterLoader.build(c.ref, this).load(c);
      this.characters.add(character, c.inTeam);
    }

    this.characters.hp = save.characters.hp;
    this.characters.mp = save.characters.mp;
    this.characters.limit = save.characters.limit;

    // zones
    for (const z of save.zones.list) {
      const zone = ZoneLoader.build(z.ref, this).load(z);
      this.zones.add(zone);
    }

    this.zones.level = save.zones.level;
    this.zones.levelMax = save.zones.levelMax;

    this.characters.available();

    // weapons
    for (const w of save.weapons) {
      const weapon = WeaponLoader.build(w.ref, this).load(w);
      this.weapons.add(weapon, w.equipped);
    }

    // materias
    for (const m of save.materias) {
      const materia = MateriaLoader.build(m.ref, this).load(m);
      this.materias.add(materia, m.equipped);
    }

    // items
    for (const i of save.items) {
      const item = ItemLoader.build(i.ref, this).load(i);
      this.items.add(item, i.equipped);
    }

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
