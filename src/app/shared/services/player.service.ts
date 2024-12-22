import { Injectable } from '@angular/core';
import { Items } from '@shared/models/items';
import { Materias } from '@shared/models/materias';
import { CharacterRef } from '@shared/models/refs/characters';
import { ItemRef } from '@shared/models/refs/items';
import { MateriaRef } from '@shared/models/refs/materias';
import { ZoneRef } from '@shared/models/refs/zones';
import { Save } from '@shared/models/save';
import { Team } from '@shared/models/team';
import { Characters } from '@shared/models/units/characters';
import { Weapons } from '@shared/models/weapons';
import { Zones } from '@shared/models/zones';
import { Difficulty } from 'src/app/shared/interfaces/difficulty';

import { LangService } from './lang.service';
import { StoreService } from './store.service';

const BASE_GILS = 200;

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  characters = new Characters();

  team = new Team();

  zones = new Zones();

  weapons = new Weapons();

  materias = new Materias();

  items = new Items();

  gils = BASE_GILS;

  language = this.langService.setDefaultLang();

  difficulty = Difficulty.Normal;

  created = new Date().getTime();

  updated = new Date().getTime();

  constructor(
    private langService: LangService,
    private storeService: StoreService,
  ) {}

  reset() {
    this.characters = new Characters();
    this.team = new Team();
    this.zones = new Zones();
    this.weapons = new Weapons();
    this.materias = new Materias();
    this.items = new Items();
    this.gils = BASE_GILS;
    this.language = this.langService.setDefaultLang();
    this.difficulty = Difficulty.Normal;
    this.created = new Date().getTime();
    this.updated = new Date().getTime();
  }

  /*
   * Basic inventory
   */
  buildLevel(level: number): void {
    // build zone
    this.zones.add(this.storeService.getZone(`zone${level}` as ZoneRef));

    const cloud = this.storeService.getCharacter(CharacterRef.Cloud);
    const barret = this.storeService.getCharacter(CharacterRef.Barret);
    const tifa = this.storeService.getCharacter(CharacterRef.Tifa);
    const aerith = this.storeService.getCharacter(CharacterRef.Aerith);
    const redxiii = this.storeService.getCharacter(CharacterRef.RedXIII);
    const yuffie = this.storeService.getCharacter(CharacterRef.Yuffie);

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
        this.materias.add(this.storeService.getMateria(MateriaRef.Restore), true);
        this.materias.add(this.storeService.getMateria(MateriaRef.Bolt), true);

        // add items
        this.items.add(this.storeService.getItem(ItemRef.Potion), true);
        this.items.add(this.storeService.getItem(ItemRef.Potion), true);

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
   * Load a save
   */
  load(save: Save, confirm = true): void {
    if (!confirm) {
      return;
    }

    // characters
    save.characters.forEach((c) => {
      const character = this.storeService.getCharacter(c.ref, c);
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
      const zone = this.storeService.getZone(z.ref, z);
      this.zones.add(zone);
    });

    this.zones.level = save.zones.level;
    this.zones.levelMax = save.zones.levelMax;

    // weapons
    save.weapons.forEach((w) => {
      const weapon = this.storeService.getWeapon(w.ref);
      this.weapons.add(weapon);
    });

    // materias
    save.materias.forEach((m) => {
      const materia = this.storeService.getMateria(m.ref, m);
      this.materias.add(materia, m.equipped);
    });

    // items
    save.items.forEach((i) => {
      const item = this.storeService.getItem(i.ref, i);
      this.items.add(item, i.equipped);
    });

    this.language = save.language;
    this.difficulty = save.difficulty;

    this.created = save.created;
    this.updated = save.updated;
    this.gils = save.gils;
  }

  /**
   * Export the game
   */
  export(): Save {
    this.updated = new Date().getTime();
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
      created: this.created,
      updated: this.updated,
    };
  }
}
