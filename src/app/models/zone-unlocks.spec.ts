import { ZONE_UNLOCKS } from './zone-unlocks';
import { MAX_ZONES } from './zones';

describe('ZONE_UNLOCKS', () => {
  const levels = Object.keys(ZONE_UNLOCKS).map(Number);

  it('only lists existing zone levels', () => {
    levels.forEach((level) => {
      expect(Number.isInteger(level)).toBe(true);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(MAX_ZONES);
    });
  });

  it('unlocks each character once, before they join the team', () => {
    const unlocked = new Set<string>();
    levels
      .sort((a, b) => a - b)
      .forEach((level) => {
        const unlock = ZONE_UNLOCKS[level];
        unlock.joinTeam?.forEach((ref) => {
          expect(unlocked.has(ref)).toBe(true);
        });
        unlock.characters?.forEach(({ ref }) => {
          expect(unlocked.has(ref)).toBe(false);
          unlocked.add(ref);
        });
      });
  });
});
