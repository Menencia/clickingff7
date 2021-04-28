import { GameService } from 'src/app/game.service';
import { Zone } from '../zone';
import { Zone1 } from '../zones/zone1';
import { Zone2 } from '../zones/zone2';

export enum ZoneRef {
  Zone1 = 'Zone1',
  Zone2 = 'Zone2'
}

export class ZoneLoader {

  /**
   *
   */
  static build(ref: ZoneRef, game: GameService): Zone {
    let zone;
    switch (ref) {
      case ZoneRef.Zone1:
        zone = new Zone1(game);
        break;
      case ZoneRef.Zone2:
        zone = new Zone2(game);
        break;
      default:
        throw new Error('Zone not found');
    }
    return zone;
  }

  /**
   *
   */
  static buildByLevel(level: number, game: GameService): Zone {
    let zone;
    switch (level) {
      case 1:
        zone = ZoneLoader.build(ZoneRef.Zone1, game);
        break;
      case 2:
        zone = ZoneLoader.build(ZoneRef.Zone2, game);
        break;
      default:
        throw new Error('Zone not found');
    }
    return zone;
  }

}
