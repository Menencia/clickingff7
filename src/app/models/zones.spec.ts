import { PHS_UNLOCK_ZONE } from '../shared/utils/game.utils';
import { Zone } from './zone';
import { Zones } from './zones';

describe('Zones', () => {
  describe('isPhsUnlocked', () => {
    it('is locked before the PHS unlock zone', () => {
      const zones = new Zones();
      expect(zones.isPhsUnlocked()).toBe(false);
      zones.levelMax = PHS_UNLOCK_ZONE - 1;
      expect(zones.isPhsUnlocked()).toBe(false);
    });

    it('is unlocked from the PHS unlock zone', () => {
      const zones = new Zones();
      zones.levelMax = PHS_UNLOCK_ZONE;
      expect(zones.isPhsUnlocked()).toBe(true);
      zones.levelMax = PHS_UNLOCK_ZONE + 1;
      expect(zones.isPhsUnlocked()).toBe(true);
    });

    it('depends on the highest zone reached, not the current one', () => {
      const zones = new Zones();
      zones.levelMax = PHS_UNLOCK_ZONE;
      zones.level = 1;
      expect(zones.isPhsUnlocked()).toBe(true);
    });
  });

  describe('clear', () => {
    it('empties the same list and goes back to zone 1', () => {
      const zones = new Zones();
      const list = zones.list;
      list.push({ level: 1 } as Zone, { level: 2 } as Zone);
      zones.level = 2;
      zones.levelMax = 2;

      zones.clear();

      expect(zones.list).toBe(list);
      expect(list).toEqual([]);
      expect(zones.level).toBe(1);
      expect(zones.levelMax).toBe(1);
    });
  });
});
