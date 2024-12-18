import { ZonesSave } from './save';
import { Zone } from './zone';

export const MAX_ZONES = 9;

export class Zones {
  list: Zone[];

  level: number;

  levelMax: number;

  nextZone: boolean;

  /**
   * Init
   */
  constructor() {
    this.list = [];
    this.level = 1;
    this.levelMax = 1;
    this.nextZone = false;
  }

  /**
   * Add a zone
   */
  add(zone: Zone): void {
    this.list.push(zone);
  }

  /**
   * Checks if all zones are complete and there is another
   */
  checkLastZone(): void {
    const zone = this.list.find((e) => e.data.level === this.levelMax);
    if (zone && zone.completed && this.level < MAX_ZONES) {
      this.nextZone = true;
    }
  }

  /**
   * Returns all the discovered zones
   */
  getAll(): Zone[] {
    const zoneLvlMax = this.levelMax;
    return this.list.filter((z: Zone) => {
      return z.data.level <= zoneLvlMax;
    });
  }

  /**
   * Return all undiscovered zones
   */
  getOthers(): Zone[] {
    const { level } = this;
    return this.list.filter((z) => {
      return z.data.level !== level;
    });
  }

  /**
   * Complete the current level zone
   */
  complete(): void {
    const zone = this.current();
    if (zone) {
      zone.completed = true;
      if (this.level < MAX_ZONES) {
        // this.level++;
        // this.levelMax++;
        this.nextZone = true;
        // this.game.buildLevel(this.levelMax);
      }
    }
  }

  /**
   * Get the current zone
   */
  current(): Zone {
    const zone = this.list.find((e) => e.data.level === this.level);

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
      if (z.data.level <= this.levelMax) {
        json.list.push(z.export());
      }
    });

    return json;
  }
}
