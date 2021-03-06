import { GameService } from '../game.service';
import { Enemy } from './enemy';
import { ZoneRef } from './refs/zones';
import { ZoneSave } from './save';

export const MAX_FIGHTS = 15;

export abstract class Zone {

  abstract ref: ZoneRef;
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
    this.nbFights = 0;
    this.completed = false;
  }

  /**
   * Extends
   */
  load(data: ZoneSave): Zone {
    this.ref = data.ref;
    this.nbFights = data.nbFights;
    this.completed = data.completed;
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
