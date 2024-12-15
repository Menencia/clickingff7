import { Injectable } from '@angular/core';
import { Items } from 'src/app/models/items';
import { Materias } from 'src/app/models/materias';
import { CharacterRef } from 'src/app/models/refs/characters';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { ZoneRef } from 'src/app/models/refs/zones';
import { Save } from 'src/app/models/save';
import { Team } from 'src/app/models/team';
import { Characters } from 'src/app/models/units/characters';
import { Weapons } from 'src/app/models/weapons';
import { Zones } from 'src/app/models/zones';
import { compareVersions } from 'src/app/shared/utils/version.utils';

import packageJson from '../../../../package.json';

import { LangService } from './lang.service';
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

  team = new Team();

  zones = new Zones();

  weapons = new Weapons();

  materias = new Materias();

  items = new Items();

  gils = BASE_GILS;

  language: string;

  difficulty = Difficulty.Normal;

  time = 0;

  version = CURRENT_VERSION;

  /**
   * init
   */
  constructor(
    private langService: LangService,
    private store: StoreService,
  ) {
    this.language = this.langService.setDefaultLang();

    // timer
    this.timer = 0;

    // load all resources
    this.run();
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
    this.team = new Team();
    this.zones = new Zones();
    this.weapons = new Weapons();
    this.materias = new Materias();
    this.items = new Items();
    this.gils = BASE_GILS;
    this.language = this.langService.setDefaultLang();
    this.difficulty = Difficulty.Normal;
    this.time = 0;
    this.version = CURRENT_VERSION;
  }

  /**
   * Refresh the game with data loaded
   */
  postload(): void {
    this.langService.useLang(this.language);

    this.team.refresh();

    this.autoTimer();
  }

  /*
   * Basic inventory
   */
  buildLevel(level: number): void {
    // build zone
    this.zones.add(this.store.getZone(`zone${level}` as ZoneRef));

    const cloud = this.store.getCharacter(CharacterRef.Cloud);
    const barret = this.store.getCharacter(CharacterRef.Barret);
    const tifa = this.store.getCharacter(CharacterRef.Tifa);
    const aerith = this.store.getCharacter(CharacterRef.Aerith);
    const redxiii = this.store.getCharacter(CharacterRef.RedXIII);
    const yuffie = this.store.getCharacter(CharacterRef.Yuffie);

    switch (level) {
      case 1:
        // add cloud in the team
        this.characters.add(cloud);
        this.weapons.add(cloud.weapon);

        // add barret in the team
        this.characters.add(barret);
        this.weapons.add(barret.weapon);

        // team
        this.team.setCharacters([cloud, barret]);

        // add materias
        this.materias.add(this.store.getMateria(MateriaRef.Restore), true);
        this.materias.add(this.store.getMateria(MateriaRef.Bolt), true);

        // add items
        this.items.add(this.store.getItem(ItemRef.Potion), true);
        this.items.add(this.store.getItem(ItemRef.Potion), true);

        break;
      case 2:
        // add tifa in the team
        this.characters.add(tifa);
        this.weapons.add(tifa.weapon);
        this.team.join(tifa);
        break;
      case 3:
        // add aerith in the team
        this.characters.add(aerith);
        this.weapons.add(aerith.weapon);
        this.team.setCharacters([cloud, aerith]);
        break;
      case 4:
        // add barret & tifa in the team
        this.team.setCharacters([cloud, barret, tifa]);
        break;
      case 5:
        // add redxiii to characters
        this.characters.add(redxiii);
        this.weapons.add(redxiii.weapon);
        break;
      case 9:
        // add yuffie to characters
        this.characters.add(yuffie);
        this.weapons.add(yuffie.weapon);
        break;
      default:
      // do nothing
    }

    // restore hp & mp
    this.team.refresh();
    this.team.hp = this.team.hpMax;
    this.team.mp = this.team.mpMax;
    this.team.limit = 0;
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
      team: this.team.export(),
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
      const character = this.store.getCharacter(c.ref, c);
      this.characters.add(character);
    });

    // team
    this.team.setCharacters(
      save.team.list.map((ref) => {
        return this.characters.list.find((c) => c.data.ref === ref)!;
      }),
    );
    this.team.load(save.team);
    this.team.refresh();

    // zones
    save.zones.list.forEach((z) => {
      const zone = this.store.getZone(z.ref, z);
      this.zones.add(zone);
    });

    this.zones.level = save.zones.level;
    this.zones.levelMax = save.zones.levelMax;

    // weapons
    save.weapons.forEach((w) => {
      const weapon = this.store.getWeapon(w.ref);
      this.weapons.add(weapon);
    });

    // materias
    save.materias.forEach((m) => {
      const materia = this.store.getMateria(m.ref, m);
      this.materias.add(materia, m.equipped);
    });

    // items
    save.items.forEach((i) => {
      const item = this.store.getItem(i.ref, i);
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
