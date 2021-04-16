import { GameService } from '../game.service';
import { Enemy } from './enemy';
import { Zone1 } from './zones/zone1';

export const MAX_FIGHTS = 15;

export enum ZoneRef {
  Zone1 = 'Zone1'
}

export interface ZoneSave {
  ref: string;
  nbFights: number;
  completed: boolean;
}

export class Zone {

  ref: string;
  nbFights: number;
  completed: boolean;
  level: number;
  image: string;
  enemies: Enemy[];
  boss: Enemy[];

  /**
   * Init
   */
  constructor(public game: GameService) {
    this.ref = this.constructor.name;
    this.nbFights = 0;
    this.completed = false;
    this.level = 0;
    this.image = '';
    this.enemies = [];
    this.boss = [];
  }

  /**
   * Extends
   */
  load(data: ZoneSave): Zone {
    Object.assign({}, this, data);
    return this;
  }

  /**
   * Go to the zone
   */
  go(): void {
    this.game.zones.level = this.level;
  }

  /**
   * Returns true if player is on this level
   */
  here(): boolean {
    return (this.level === this.game.zones.level);
  }

  /**
   * Save zone data
   */
  export(): ZoneSave {
    const {ref, nbFights, completed} = this;
    return {ref, nbFights, completed};
  }

}
