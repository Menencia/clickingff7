import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { CharacterJson } from '../../models/character';
import { EnemyJson } from '../../models/enemy';
import { ItemJson } from '../../models/item';
import { MateriaJson } from '../../models/materia';
import { WeaponJson } from '../../models/weapon';
import { ZoneJson } from '../../models/zone';

/**
 * Raw game definitions loaded from `assets/data/*.json`.
 * Model instances are built on demand by StoreService.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  zones: ZoneJson[] = [];

  enemies: EnemyJson[] = [];

  weapons: WeaponJson[] = [];

  characters: CharacterJson[] = [];

  items: ItemJson[] = [];

  materias: MateriaJson[] = [];

  preloadAll(): Observable<void> {
    return forkJoin([
      this.http.get<EnemyJson[]>('assets/data/enemies.json'),
      this.http.get<ZoneJson[]>('assets/data/zones.json'),
      this.http.get<WeaponJson[]>('assets/data/weapons.json'),
      this.http.get<CharacterJson[]>('assets/data/characters.json'),
      this.http.get<ItemJson[]>('assets/data/items.json'),
      this.http.get<MateriaJson[]>('assets/data/materias.json'),
    ]).pipe(
      map(([enemies, zones, weapons, characters, items, materias]) => {
        this.enemies = enemies;
        this.zones = zones;
        this.weapons = weapons;
        this.characters = characters;
        this.items = items;
        this.materias = materias;
      }),
    );
  }
}
