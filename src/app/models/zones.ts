import { GameService } from '../game.service';
import { ZonesSave } from './save';
import { Zone } from './zone';

export const MAX_ZONES = 8;

export class Zones {

  list: Zone[];
  level: number;
  levelMax: number;
  nextZone: boolean;

  /**
   * Init
   */
  constructor(public game: GameService) {
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
    const zone = this.list.find((e) => e.level === this.levelMax);
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
      return (z.level <= zoneLvlMax);
    });
  }

  /**
   * Return all undiscovered zones
   */
  getOthers(): Zone[] {
    const level = this.level;
    return this.list.filter((z) => {
      return (z.level !== level);
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
    const zone = this.list.find(e => e.level === this.level);

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
   * Go next zone
   */
  goNextZone(): void {
    this.level++;

    // Known level
    if (this.level <= this.levelMax) {
      this.goZone(this.level);
    }

    // New level
    else {
      this.levelMax++;
      this.nextZone = false;
      this.game.buildLevel(this.level);
      this.game.characters.refresh();
      this.game.shop.refresh();
    }
  }

  /**
   * Go to the level zone
   */
  goZone(level: number): void {
    this.level = level;
  }

  /**
   * Save zones data
   */
  export(): ZonesSave {
    const json: ZonesSave = {
      level: this.level,
      levelMax: this.levelMax,
      list: []
    };

    for (const z of this.list) {
      if (z.level <= this.levelMax) {
        json.list.push(z.export());
      }
    }

    return json;
  }

}
