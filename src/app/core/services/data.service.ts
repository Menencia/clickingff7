import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { CharacterJson } from 'src/app/models/character';
import { EnemyJson } from 'src/app/models/enemy';
import { ItemJson } from 'src/app/models/item';
import { MateriaJson } from 'src/app/models/materia';
import { CharacterRef } from 'src/app/models/refs/characters';
import { EnemyRef } from 'src/app/models/refs/enemy';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { ZoneRef } from 'src/app/models/refs/zones';
import { WeaponJson } from 'src/app/models/weapon';
import { ZoneJson } from 'src/app/models/zone';

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
