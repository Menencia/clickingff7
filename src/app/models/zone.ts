import { Enemy } from './enemy'
import { ZoneRef } from './refs/zones'
import { ZoneSave } from './save'

export const MAX_FIGHTS = 15

export abstract class Zone {

  abstract ref: ZoneRef;
  nbFights: number
  completed: boolean

  abstract level: number;
  abstract image: string;
  abstract enemies: Enemy[];
  abstract boss: Enemy[];

  /**
   * Init
   */
  constructor() {
    this.nbFights = 0
    this.completed = false
  }

  /**
   * Extends
   */
  load(data: ZoneSave): Zone {
    this.ref = data.ref
    this.nbFights = data.nbFights
    this.completed = data.completed
    return this
  }

  /**
   * Save zone data
   */
  export(): ZoneSave {
    const {ref, nbFights, completed} = this
    return {ref, nbFights, completed}
  }

}
