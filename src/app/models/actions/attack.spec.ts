import { Context } from '../context';
import { Attack } from './attack';

/**
 * Mocks the three random draws of calculateHits: variance, rounding
 * (0.5 rounds to the nearest integer), then critical
 */
function mockRandom(variance: number, critical: number, rounding = 0.5): void {
  vi.spyOn(Math, 'random')
    .mockReturnValueOnce(variance)
    .mockReturnValueOnce(rounding)
    .mockReturnValueOnce(critical);
}

const NO_CRITICAL = 0.999999;
const CRITICAL = 0;

describe('Attack', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculateHits', () => {
    it('applies the power to the base hits', () => {
      // 200 × 50 / 100 = 100, middle of the variance range
      mockRandom(0.5, NO_CRITICAL);
      expect(new Attack(200, 50).calculateHits()).toBe(100);
    });

    it('returns -10% at the lowest random draw', () => {
      mockRandom(0, NO_CRITICAL);
      expect(new Attack(100, 100).calculateHits()).toBe(90);
    });

    it('returns +10% at the highest random draw', () => {
      mockRandom(0.999999, NO_CRITICAL);
      expect(new Attack(100, 100).calculateHits()).toBe(110);
    });

    it('doubles the hits on a critical', () => {
      mockRandom(0.5, CRITICAL);
      expect(new Attack(100, 100).calculateHits()).toBe(200);
    });

    it.each([
      // random(0, 100) <= 10, i.e. Math.random() < 11 / 101
      { draw: 0.1, critical: true },
      { draw: 0.109, critical: false },
    ])('critical at draw $draw: $critical', ({ draw, critical }) => {
      mockRandom(0.5, draw);
      expect(new Attack(100, 100).calculateHits()).toBe(critical ? 200 : 100);
    });

    it.each([
      // 5 × (1 - 10%) = 4.5: rounded down below a 0.5 rounding draw
      { base: 5, variance: 0, rounding: 0.4, hits: 4 },
      { base: 5, variance: 0, rounding: 0.5, hits: 5 },
      // 5 × (1 + 10%) ≈ 5.5: rounded up above a 0.5 rounding draw
      { base: 5, variance: 0.999999, rounding: 0.51, hits: 6 },
      { base: 5, variance: 0.999999, rounding: 0.4, hits: 5 },
      // 1 × (1 + 10%) ≈ 1.1: rounded up above a 0.9 rounding draw
      { base: 1, variance: 0.999999, rounding: 0.91, hits: 2 },
      { base: 1, variance: 0.999999, rounding: 0.89, hits: 1 },
      // 1 × (1 - 10%) = 0.9 rounded down: never below 1
      { base: 1, variance: 0, rounding: 0, hits: 1 },
    ])(
      'returns $hits for $base base hits (variance $variance, rounding $rounding)',
      ({ base, variance, rounding, hits }) => {
        mockRandom(variance, NO_CRITICAL, rounding);
        expect(new Attack(base, 100).calculateHits()).toBe(hits);
      },
    );
  });

  describe('use', () => {
    it('attacks the enemies with the computed hits', () => {
      mockRandom(0.5, NO_CRITICAL);
      const getAttacked = vi.fn();
      const attack = new Attack(100, 100, ['fire']);
      const context = {
        battle: { enemies: { getAttacked } },
      } as unknown as Context;

      attack.use(context);

      expect(getAttacked).toHaveBeenCalledWith(100, attack, false);
    });

    it('tells the enemies when the hit is critical', () => {
      mockRandom(0.5, CRITICAL);
      const getAttacked = vi.fn();
      const attack = new Attack(100, 100);
      const context = {
        battle: { enemies: { getAttacked } },
      } as unknown as Context;

      attack.use(context);

      expect(getAttacked).toHaveBeenCalledWith(200, attack, true);
    });

    it('does nothing outside a battle', () => {
      const context = { battle: undefined } as unknown as Context;
      expect(() => new Attack(100, 100).use(context)).not.toThrow();
    });
  });
});
