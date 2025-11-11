import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterJson } from '@shared/models/character';
import { EnemyJson } from '@shared/models/enemy';
import { ItemJson } from '@shared/models/item';
import { MateriaJson } from '@shared/models/materia';
import { CharacterRef } from '@shared/models/refs/characters';
import { EnemyRef } from '@shared/models/refs/enemy';
import { ItemRef } from '@shared/models/refs/items';
import { MateriaRef } from '@shared/models/refs/materias';
import { WeaponRef } from '@shared/models/refs/weapons';
import { ZoneRef } from '@shared/models/refs/zones';
import { WeaponJson } from '@shared/models/weapon';
import { ZoneJson } from '@shared/models/zone';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  zones: ZoneJson[] = [];

  enemies: EnemyJson[] = [];

  weapons: WeaponJson[] = [];

  characters: CharacterJson[] = [];

  items: ItemJson[] = [];

  materias: MateriaJson[] = [];

  constructor(private http: HttpClient) {}

  /** Loads all stores from assets */
  preloadAll(): Observable<void> {
    return forkJoin({
      enemies: this.http.get<EnemyJson[]>('assets/data/enemies.json'),
      zones: this.http.get<ZoneJson[]>('assets/data/zones.json'),
      weapons: this.http.get<WeaponJson[]>('assets/data/weapons.json'),
      characters: this.http.get<CharacterJson[]>('assets/data/characters.json'),
      items: this.http.get<ItemJson[]>('assets/data/items.json'),
      materias: this.http.get<MateriaJson[]>('assets/data/materias.json'),
    }).pipe(
      map((result) => {
        this.enemies = result.enemies;
        this.zones = result.zones;
        this.weapons = result.weapons;
        this.characters = result.characters;
        this.items = result.items;
        this.materias = result.materias;
      }),
    );
  }

  /** Return Zone data from given ref */
  getZone(ref: ZoneRef): ZoneJson {
    return this.retrieve(this.zones, ref);
  }

  /** Return Enemy data from given ref */
  getEnemy(ref: EnemyRef): EnemyJson {
    return this.retrieve(this.enemies, ref);
  }

  /** Return Weapon data from given ref */
  getWeapon(ref: WeaponRef): WeaponJson {
    return this.retrieve(this.weapons, ref);
  }

  /** Return Character data from given ref */
  getCharacter(ref: CharacterRef): CharacterJson {
    return this.retrieve(this.characters, ref);
  }

  /** Return Item data from given ref */
  getItem(ref: ItemRef): ItemJson {
    return this.retrieve(this.items, ref);
  }

  /** Return Materia data from given ref */
  getMateria(ref: MateriaRef): MateriaJson {
    return this.retrieve(this.materias, ref);
  }

  /** Search in given store the given ref & returns it */
  private retrieve<T extends { ref: U }, U>(store: T[], ref: U): T {
    const found = store.find((e) => e.ref === ref);
    if (found) {
      return found;
    }
    throw new Error(`${ref} not found`);
  }
}
