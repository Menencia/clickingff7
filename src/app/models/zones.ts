import { ZonesSave } from './save';
import { Zone } from './zone';

export const MAX_ZONES = 9;

export class Zones {
  list: Zone[];

  level: number;

  levelMax: number;

  /**
   * Init
   */
  constructor() {
    this.list = [];
    this.level = 1;
    this.levelMax = 1;
  }

  /**
   * Add a zone
   */
  add(zone: Zone): void {
    this.list.push(zone);
  }

  /**
   * Moves to an unlocked zone. Does nothing if the zone is not unlocked.
   */
  goTo(level: number): void {
    if (level <= this.levelMax && this.list.some((z) => z.level === level)) {
      this.level = level;
    }
  }

  /**
   * Complete the current level zone
   */
  complete(): void {
    const zone = this.current();
    if (zone) {
      zone.completed = true;
    }
  }

  /**
   * Get the current zone
   */
  current(): Zone {
    const zone = this.list.find((e) => e.level === this.level);

    if (!zone) {
      throw new Error('Zone not found');
    }

    return zone;
  }

  /**
   * Get the next zone available
   */
  isNextZone(): boolean {
    const zone = this.current();
    if (zone) {
      return zone.completed && this.levelMax < MAX_ZONES;
    }
    return false;
  }

  /**
   * Save zones data
   */
  export(): ZonesSave {
    const json: ZonesSave = {
      level: this.level,
      levelMax: this.levelMax,
      list: [],
    };

    this.list.forEach((z) => {
      if (z.level <= this.levelMax) {
        json.list.push(z.export());
      }
    });

    return json;
  }
}
