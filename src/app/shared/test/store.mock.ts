import { Zone, ZoneData } from 'src/app/models/zone';

export class StoreServiceMock {
  zones: Zone[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getZone(ref: string): Zone {
    return new Zone({
      ref: 'zone1',
      level: 1,
      image: '/assets/images/zones/Sector_1_Reactor.png',
      enemies: [],
      boss: [],
    } as ZoneData);
  }
}
