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

  constructor(
    public readonly data: Readonly<ZoneJson>,
    public enemies: Enemy[],
    public boss: Enemy[],
  ) {}

  load(save: ZoneSave) {
    this.completed = save.completed;
    this.nbFights = save.nbFights;
  }

  /**
   * Save zone data
   */
  export(): ZoneSave {
    const { nbFights, completed } = this;
    return { ref: this.data.ref, nbFights, completed };
  }
}
