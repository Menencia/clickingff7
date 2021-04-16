import { GameService } from '../game.service';
import { Enemy } from './enemy';
import { ZoneRef } from './loaders/zone-loader';
import { ZoneSave } from './save';

export const MAX_FIGHTS = 15;

export abstract class Zone {

  ref: ZoneRef;
  nbFights: number;
  completed: boolean;

  abstract level: number;
  abstract image: string;
  abstract enemies: Enemy[];
  abstract boss: Enemy[];

  /**
   * Init
   */
  constructor(public game: GameService) {
    this.ref = this.constructor.name as ZoneRef;
    this.nbFights = 0;
    this.completed = false;
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
