import { Enemy } from './enemy';
import { ZoneRef } from './refs/zones';
import { ZoneSave } from './save';

export const MAX_FIGHTS = 15;

interface ZoneBase {
  ref: ZoneRef;
  level: number;
  image: string;
}

export interface ZoneJson extends ZoneBase {
  enemies: string[];
  boss: string[];
}

export interface ZoneData extends ZoneBase {
  enemies: Enemy[];
  boss: Enemy[];
}

export class Zone {
  /** Number of fights done in the zone */
  nbFights = 0;

  /** True if boss has been beaten */
  completed = false;

  ref: ZoneRef;

  level: number;

  image: string;

  enemies: Enemy[];

  boss: Enemy[];

  constructor(data: ZoneData) {
    this.ref = data.ref;
    this.level = data.level;
    this.image = data.image;
    this.enemies = data.enemies;
    this.boss = data.boss;
  }

  load(zoneSave: ZoneSave): Zone {
    this.completed = zoneSave.completed;
    this.nbFights = zoneSave.nbFights;
    return this;
  }

  /**
   * Save zone data
   */
  export(): ZoneSave {
    const { ref, nbFights, completed } = this;
    return { ref, nbFights, completed };
  }
}
