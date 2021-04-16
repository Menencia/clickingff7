import { GameService } from 'src/app/game.service';
import { Zone, ZoneRef } from '../zone';
import { Zone1 } from '../zones/zone1';

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
      default:
        throw new Error('Zone not found');
    }
    return zone;
  }

}
