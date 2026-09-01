/** biome-ignore-all lint/style/noNonNullAssertion: will be removed later */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Character, CharacterJson } from '../../models/character';
import { Enemy, EnemyJson } from '../../models/enemy';
import { Item, ItemJson } from '../../models/item';
import { HpPotion } from '../../models/items/hp-potion';
import { MpPotion } from '../../models/items/mp-potion';
import { Materia, MateriaJson } from '../../models/materia';
import {
  AttackMateria,
  AttackMateriaJson,
} from '../../models/materias/attack-materia';
import { CureMateria } from '../../models/materias/cure-materia';
import { Weapon, WeaponJson } from '../../models/weapon';
import { Zone, ZoneJson } from '../../models/zone';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  zones: Zone[] = [];

  enemies: Enemy[] = [];

  weapons: Weapon[] = [];

  characters: Character[] = [];

  items: Item[] = [];

  materias: Materia[] = [];

  constructor(private http: HttpClient) {}

  preloadAll(): Observable<void> {
    return forkJoin([
      this.preloadEnemies(),
      this.preloadZones(),
      this.preloadWeapons(),
      this.preloadCharacters(),
      this.preloadItems(),
      this.preloadMaterias(),
    ]).pipe(
      map(([enemies, zones, weapons, characters, items, materias]) => {
        this.buildEnemies(enemies);
        this.buildZones(zones);
        this.buildWeapons(weapons);
        this.buildCharacters(characters);
        this.buildItems(items);
        this.buildMaterias(materias);
      }),
    );
  }

  /** Depends: none */
  private buildEnemies(enemies: EnemyJson[]) {
    this.enemies = enemies.map((data) => new Enemy(data));
  }

  /** Depends: enemies */
  private buildZones(zones: ZoneJson[]) {
    this.zones = zones.map((data) => {
      const zoneData = {
        ...data,
        enemies: data.enemies.map(
          (ref) => this.enemies.find((e) => e.ref === ref)!,
        ),
        boss: data.boss.map((ref) => this.enemies.find((e) => e.ref === ref)!),
      };
      return new Zone(zoneData);
    });
  }

  /** Depends: none */
  private buildWeapons(weapons: WeaponJson[]) {
    this.weapons = weapons.map((data) => new Weapon(data));
  }

  /** Depends: enemies */
  private buildCharacters(characters: CharacterJson[]) {
    this.characters = characters.map((data) => {
      const characterData = {
        ...data,
        weapon: this.weapons.find((e) => e.ref === data.weapon)!,
      };
      return new Character(characterData);
    });
  }

  /** Depends: none */
  private buildItems(items: ItemJson[]) {
    this.items = items.map((data) => {
      switch (data.type) {
        case 'hp-potion':
          return new HpPotion(data);
        case 'mp-potion':
          return new MpPotion(data);
        default:
          throw new Error(`Item of type ${data.type} not found`);
      }
    });
  }

  /** Depends: none */
  private buildMaterias(materias: MateriaJson[]) {
    this.materias = materias.map((data) => {
      switch (data.type) {
        case 'attack':
          return new AttackMateria(data as AttackMateriaJson);
        case 'cure':
          return new CureMateria(data);
        default:
          throw new Error(`Materia of type ${data.type} not found`);
      }
    });
  }

  private preloadEnemies() {
    return this.http.get<EnemyJson[]>('assets/data/enemies.json');
  }

  private preloadZones() {
    return this.http.get<ZoneJson[]>('assets/data/zones.json');
  }

  private preloadWeapons() {
    return this.http.get<WeaponJson[]>('assets/data/weapons.json');
  }

  private preloadCharacters() {
    return this.http.get<CharacterJson[]>('assets/data/characters.json');
  }

  private preloadItems() {
    return this.http.get<ItemJson[]>('assets/data/items.json');
  }

  private preloadMaterias() {
    return this.http.get<MateriaJson[]>('assets/data/materias.json');
  }
}
