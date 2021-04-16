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
import { CharacterLoader, CharacterRef } from './models/loaders/character-loader';
import { WeaponLoader, WeaponRef } from './models/loaders/weapon-loader';
import { ItemLoader, ItemRef } from './models/loaders/item-loader';
import { MateriaLoader, MateriaRef } from './models/loaders/materia-loader';

const SAVE_1 = 'save1';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  loaded: boolean;
  mode: string;
  timer: number;

  battle: Battle;
  shop: Shop;
  enemies: Enemies;

  characters: Characters;
  zones: Zones;
  weapons: Weapons;
  materias: Materias;
  items: Items;

  gils: number;
  language: string;
  difficulty: number;
  time: number;
  version: string;

  saves: Save[];
  lastExport: string;

  constructor(public translateService: TranslateService) {
    // detect first load
    this.loaded = false;

    // fight mode
    // @deprecated
    this.mode = 'normal';

    // timer
    this.timer = 0;

    // temp models
    this.battle = new Battle(this);
    this.shop = new Shop(this);
    this.enemies = new Enemies(this);

    // savable models
    this.characters = new Characters(this);
    this.zones = new Zones(this);
    this.weapons = new Weapons(this);
    this.materias = new Materias(this);
    this.items = new Items(this);

    // savable vars
    this.gils = 200;
    this.language = this.getLanguage(translateService.getDefaultLang());
    this.difficulty = 2;
    this.time = 0;
    this.version = '1.1.2';

    this.saves = [];
    this.lastExport = '';

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
    this.loaded = true;

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
    // this.$translate.use(this.language);

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
    const data = {level: levelMax};

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
      // case 2:
      //   // add tifa in the team
      //   this.characters.add(new Tifa(this).load(data), true);
      //   this.weapons.add(new LeatherGlove(this), true);
      //   break;
      // case 3:
      //   // add aerith in the team
      //   this.characters.add(new Aerith(this).load(data), true);
      //   this.weapons.add(new GuardStick(this), true);
      //   break;
      // case 4:
      //   // add barret & tifa in the team
      //   for (var c of this.characters.list) {
      //     if (c.constructor.name === 'Barret' || c.constructor.name === 'Tifa') {
      //       c.inTeam = true;
      //     }
      //   }
      //   break;
      // case 5:
      //   // add redxiii in the team
      //   this.characters.add(new RedXIII(this).load(data), true);
      //   this.weapons.add(new MythrilClip(this), true);
      //   break;
      // case 9:
      //   // add yuffie in the team
      //   this.characters.add(new Yuffie(this).load(data), true);
      //   this.weapons.add(new FPtShuriken(this), true);
      //   break;
    }

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
    // if (!confirm) {
    //   return;
    // }

    // // characters
    // for (const c of save.characters.list) {
    //   const character = new window[c.ref](this).load(c);
    //   this.characters.add(character, c.inTeam);
    // }

    // this.characters.hp = save.characters.hp;
    // this.characters.mp = save.characters.mp;
    // this.characters.limit = save.characters.limit;

    // // zones
    // for (const z of save.zones.list) {
    //   const zone = new window[z.ref](this).load(z);
    //   this.zones.add(zone);
    // }

    // this.zones.level = save.zones.level;
    // this.zones.levelMax = save.zones.levelMax;

    // this.characters.available();

    // // weapons
    // for (const w of save.weapons) {
    //   const weapon = new window[w.ref](this).load(w);
    //   this.weapons.add(weapon, w.equipped);
    // }

    // // materias
    // for (const m of save.materias) {
    //   const materia = new window[m.ref](this).load(m);
    //   this.materias.add(materia, m.equipped);
    // }

    // // items
    // for (const i of save.items) {
    //   const item = new window[i.ref](this).load(i);
    //   this.items.add(item, i.equipped);
    // }

    // this.language = save.language;
    // this.difficulty = save.difficulty;

    // this.time = save.time;
    // this.gils = save.gils;

    // this.loaded = true;
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
