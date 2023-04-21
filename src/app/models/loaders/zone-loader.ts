import { ZoneRef } from '../refs/zones';
import { Zone } from '../zone';
import { Zone1 } from '../zones/zone1';
import { Zone2 } from '../zones/zone2';
import { Zone3 } from '../zones/zone3';
import { Zone4 } from '../zones/zone4';
import { Zone5 } from '../zones/zone5';
import { Zone6 } from '../zones/zone6';
import { Zone7 } from '../zones/zone7';
import { Zone8 } from '../zones/zone8';
import { Zone9 } from '../zones/zone9';

export class ZoneLoader {

  /**
   *
   */
  static build(ref: ZoneRef): Zone {
    let zone;
    switch (ref) {
      case ZoneRef.Zone1:
        zone = new Zone1();
        break;
      case ZoneRef.Zone2:
        zone = new Zone2();
        break;
      case ZoneRef.Zone3:
        zone = new Zone3();
        break;
      case ZoneRef.Zone4:
        zone = new Zone4();
        break;
      case ZoneRef.Zone5:
        zone = new Zone5();
        break;
      case ZoneRef.Zone6:
        zone = new Zone6();
        break;
      case ZoneRef.Zone7:
        zone = new Zone7();
        break;
      case ZoneRef.Zone8:
        zone = new Zone8();
        break;
      case ZoneRef.Zone9:
        zone = new Zone9();
        break;
      default:
        throw new Error('Zone not found');
    }
    return zone;
  }

  /**
   *
   */
  static buildByLevel(level: number): Zone {
    let zone;
    switch (level) {
      case 1:
        zone = ZoneLoader.build(ZoneRef.Zone1);
        break;
      case 2:
        zone = ZoneLoader.build(ZoneRef.Zone2);
        break;
      case 3:
        zone = ZoneLoader.build(ZoneRef.Zone3);
        break;
      case 4:
        zone = ZoneLoader.build(ZoneRef.Zone4);
        break;
      case 5:
        zone = ZoneLoader.build(ZoneRef.Zone5);
        break;
      case 6:
        zone = ZoneLoader.build(ZoneRef.Zone6);
        break;
      case 7:
        zone = ZoneLoader.build(ZoneRef.Zone7);
        break;
      case 8:
        zone = ZoneLoader.build(ZoneRef.Zone8);
        break;
      case 9:
        zone = ZoneLoader.build(ZoneRef.Zone9);
        break;
      default:
        throw new Error('Zone not found');
    }
    return zone;
  }

}
