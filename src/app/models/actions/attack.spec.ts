import { Context } from '../context';
import { Attack } from './attack';

/** Mocks the two random draws of calculateHits: variance, then critical */
function mockRandom(variance: number, critical: number): void {
  vi.spyOn(Math, 'random')
    .mockReturnValueOnce(variance)
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

    // Current behaviour on small values: the spread exceeds ±10%
    // (refactors.md n°2 will narrow it).
    it.each([
      { base: 5, draw: 0, hits: 4 },
      { base: 5, draw: 0.5, hits: 5 },
      { base: 5, draw: 0.999999, hits: 6 },
      { base: 1, draw: 0, hits: 0 },
      { base: 1, draw: 0.5, hits: 1 },
      { base: 1, draw: 0.999999, hits: 2 },
    ])(
      'returns $hits for $base base hits at draw $draw',
      ({ base, draw, hits }) => {
        mockRandom(draw, NO_CRITICAL);
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

      expect(getAttacked).toHaveBeenCalledWith(100, attack);
    });

    it('does nothing outside a battle', () => {
      const context = { battle: undefined } as unknown as Context;
      expect(() => new Attack(100, 100).use(context)).not.toThrow();
    });
  });
});
