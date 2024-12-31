import { randomFromArray } from '@shared/utils/math.utils';

import { Enemy } from './enemy';
import { EnemyRef } from './refs/enemy';
import { ZoneRef } from './refs/zones';
import { ZoneSave } from './save';

export const MAX_FIGHTS = 15;

interface ZoneBase {
  ref: ZoneRef;
  level: number;
  image: string;
}

export interface ZoneJson extends ZoneBase {
  enemies: EnemyRef[];
  boss: EnemyRef[];
}

export interface ZoneData extends ZoneBase {
  enemies: Enemy[];
  boss: Enemy[];
}

export class Zone {
  constructor(
    public readonly data: Readonly<ZoneJson>,
    /** Number of fights done in the zone */
    public nbFights = 0,
    /** True if boss has been beaten */
    public completed = false,
  ) {}

  getRandomEnemyRef(): EnemyRef {
    return randomFromArray(this.data.enemies);
  }

  export(): ZoneSave {
    const { nbFights, completed } = this;
    return { ref: this.data.ref, nbFights, completed };
  }
}
