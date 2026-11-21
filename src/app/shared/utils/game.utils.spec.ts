import { inverseStatFactor, statFactor, withVariance } from './game.utils';

describe('game utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('statFactor', () => {
    it.each([
      [1, 0.8],
      [2, 0.9],
      [3, 1],
      [4, 1.1],
      [5, 1.2],
    ])('returns the multiplier for stat %i', (stat, expected) => {
      expect(statFactor(stat)).toBeCloseTo(expected);
    });
  });

  describe('inverseStatFactor', () => {
    it.each([1, 2, 3, 4, 5])(
      'matches the former XP formula for stat %i',
      (stat) => {
        expect(inverseStatFactor(stat)).toBe(((3 - stat) * 10) / 100 + 1);
      },
    );
  });

  describe('withVariance', () => {
    it('returns the lower bound (-10%) when random is 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(withVariance(100)).toBe(90);
    });

    it('stays within ±10% of the value', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999999);
      const hits = withVariance(100);
      expect(hits).toBeGreaterThanOrEqual(90);
      expect(hits).toBeLessThanOrEqual(110);
    });
  });
});
