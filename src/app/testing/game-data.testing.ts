import { HttpClient } from '@angular/common/http';
import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import characters from '../../assets/data/characters.json';
import enemies from '../../assets/data/enemies.json';
import items from '../../assets/data/items.json';
import materias from '../../assets/data/materias.json';
import weapons from '../../assets/data/weapons.json';
import zones from '../../assets/data/zones.json';
import { DataService } from '../core/services/data.service';

const GAME_DATA: Record<string, unknown> = {
  'assets/data/characters.json': characters,
  'assets/data/enemies.json': enemies,
  'assets/data/items.json': items,
  'assets/data/materias.json': materias,
  'assets/data/weapons.json': weapons,
  'assets/data/zones.json': zones,
};

/**
 * Serves the real game data files from memory instead of HTTP.
 */
export function provideInMemoryGameData(): Provider {
  return {
    provide: HttpClient,
    useValue: {
      get: (url: string): Observable<unknown> =>
        url in GAME_DATA
          ? of(structuredClone(GAME_DATA[url]))
          : throwError(() => new Error(`Unexpected request: ${url}`)),
    },
  };
}

/**
 * Builds the game catalog, as the app initializer does.
 * Must run before injecting GameService.
 */
export function loadGameData(): Promise<void> {
  return firstValueFrom(TestBed.inject(DataService).preloadAll());
}

/**
 * In-memory replacement for localStorage. Node >= 25 defines its own
 * `localStorage` global, which is undefined without --localstorage-file
 * and hides the jsdom one. Supports bracket access like the real Storage
 * (`localStorage['save1']`), as GameService uses it.
 */
export class MemoryStorage implements Storage {
  // biome-ignore lint/suspicious/noExplicitAny: Storage has an index signature
  [key: string]: any;

  get length(): number {
    return Object.keys(this).length;
  }

  clear(): void {
    for (const key of Object.keys(this)) {
      delete this[key];
    }
  }

  getItem(key: string): string | null {
    return Object.hasOwn(this, key) ? String(this[key]) : null;
  }

  key(index: number): string | null {
    return Object.keys(this)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this[key];
  }

  setItem(key: string, value: string): void {
    this[key] = String(value);
  }
}
