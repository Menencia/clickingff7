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
    /** Mocks the two random draws: variance, then rounding */
    function draws(variance: number, rounding: number): void {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(variance)
        .mockReturnValueOnce(rounding);
    }

    it.each([
      { value: 100, variance: 0, rounding: 0.5, expected: 90 },
      { value: 100, variance: 0.5, rounding: 0.5, expected: 100 },
      { value: 100, variance: 0.999999, rounding: 0.5, expected: 110 },
      { value: 20, variance: 0, rounding: 0, expected: 18 },
      { value: 20, variance: 0.999999, rounding: 0.999999, expected: 22 },
      // 5 ± 10% = 4.5 to 5.5
      { value: 5, variance: 0, rounding: 0.49, expected: 4 },
      { value: 5, variance: 0, rounding: 0.5, expected: 5 },
      { value: 5, variance: 0.999999, rounding: 0.51, expected: 6 },
      // 4.3 without variance: rounded up 30% of the time
      { value: 4.3, variance: 0.5, rounding: 0.69, expected: 4 },
      { value: 4.3, variance: 0.5, rounding: 0.7, expected: 5 },
      // 1 ± 10% = 0.9 to 1.1: never below 1
      { value: 1, variance: 0, rounding: 0, expected: 1 },
      { value: 1, variance: 0.999999, rounding: 0.95, expected: 2 },
      { value: 0, variance: 0.999999, rounding: 0.999999, expected: 0 },
    ])(
      'returns $expected for $value (variance $variance, rounding $rounding)',
      ({ value, variance, rounding, expected }) => {
        draws(variance, rounding);
        expect(withVariance(value)).toBe(expected);
      },
    );

    /** Results of withVariance over a regular grid of both draws */
    function results(value: number): number[] {
      const steps = 100;
      const list: number[] = [];
      for (let v = 0; v < steps; v++) {
        for (let r = 0; r < steps; r++) {
          draws((v + 0.5) / steps, (r + 0.5) / steps);
          list.push(withVariance(value));
        }
      }
      return list;
    }

    it.each([2, 3, 5, 7, 10, 15, 100])(
      'stays between the integers around ±10%% of %i',
      (value) => {
        const list = results(value);
        expect(Math.min(...list)).toBeGreaterThanOrEqual(
          Math.floor(value * 0.9),
        );
        expect(Math.max(...list)).toBeLessThanOrEqual(Math.ceil(value * 1.1));
      },
    );

    it.each([2, 3, 5, 10])('still varies on the small value %i', (value) => {
      const list = results(value);
      expect(Math.min(...list)).toBe(value - 1);
      expect(Math.max(...list)).toBe(value + 1);
    });

    it.each([2, 4.3, 5, 10, 100])('averages to %d', (value) => {
      const list = results(value);
      const average = list.reduce((sum, hits) => sum + hits, 0) / list.length;
      expect(average).toBeCloseTo(value, 2);
    });
  });
});
