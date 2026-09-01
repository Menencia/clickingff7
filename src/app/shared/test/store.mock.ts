import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { Weapon } from '../../models/weapon';
import { Zone } from '../../models/zone';

export class StoreServiceMock {
  zones: Zone[] = [];

  getZone(ref: ZoneRef): Zone {
    return new Zone({
      ref,
      level: 1,
      image: '/assets/images/zones/Sector_1_Reactor.png',
      enemies: [],
      boss: [],
    });
  }

  getWeapon(ref: WeaponRef): Weapon {
    return new Weapon({
      ref,
      type: 'broadsword',
      hits: 0,
      maxMaterias: 0,
      price: 0,
      zoneAvailable: 0,
    });
  }
}
