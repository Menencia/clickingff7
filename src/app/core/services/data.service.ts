import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Enemy, EnemyJson } from 'src/app/models/enemy';
import { Zone, ZoneJson } from 'src/app/models/zone';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  zones: Zone[] = [];

  enemies: Enemy[] = [];

  constructor(private http: HttpClient) {}

  preloadAll(): Observable<void> {
    return forkJoin([this.preloadEnemies(), this.preloadZones()]).pipe(
      map(([enemies, zones]) => {
        this.buildEnemies(enemies);
        this.buildZones(zones);
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

  private preloadEnemies() {
    return this.http.get<EnemyJson[]>('assets/data/enemies.json');
  }

  private preloadZones() {
    return this.http.get<ZoneJson[]>('assets/data/zones.json');
  }
}
