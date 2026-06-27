import { Items } from '@shared/models/items';
import { Materias } from '@shared/models/materias';
import { ZoneRef } from '@shared/models/refs/zones';
import { Zone } from '@shared/models/zone';
import { Zones } from '@shared/models/zones';

const mockZone = new Zones();
mockZone.add(
  new Zone({ ref: ZoneRef.Zone1, level: 1, image: '', enemies: [], boss: [] }),
);

const playerServiceMock = {
  zones: {
    current: () => mockZone,
    level: 1,
    list: [mockZone],
    levelMax: 1,
    nextZone: false,
  },
  materias: new Materias(),
  items: new Items(),
};

export { playerServiceMock };
