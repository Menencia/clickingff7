import { Context } from '../context';
import { Cure } from './cure';

describe('Cure', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculateHits', () => {
    it.each([
      // 200 × 50 / 100 = 100
      { draw: 0, hits: 90 },
      { draw: 0.5, hits: 100 },
      { draw: 0.999999, hits: 110 },
    ])('returns $hits at draw $draw', ({ draw, hits }) => {
      vi.spyOn(Math, 'random').mockReturnValue(draw);
      expect(new Cure(200, 50).calculateHits()).toBe(hits);
    });

    it('never doubles the cure', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(new Cure(100, 100).calculateHits()).toBe(90);
    });

    it.each([
      // 5 × (1 ± 10%) = 4.5 to 5.5: the rounding draw picks 4, 5 or 6
      { base: 5, variance: 0, rounding: 0.4, hits: 4 },
      { base: 5, variance: 0, rounding: 0.5, hits: 5 },
      { base: 5, variance: 0.999999, rounding: 0.51, hits: 6 },
      // 1 × (1 ± 10%) = 0.9 to 1.1: 2 is possible, 0 is not
      { base: 1, variance: 0.999999, rounding: 0.95, hits: 2 },
      { base: 1, variance: 0, rounding: 0, hits: 1 },
    ])(
      'returns $hits for $base base hits (variance $variance, rounding $rounding)',
      ({ base, variance, rounding, hits }) => {
        vi.spyOn(Math, 'random')
          .mockReturnValueOnce(variance)
          .mockReturnValueOnce(rounding);
        expect(new Cure(base, 100).calculateHits()).toBe(hits);
      },
    );
  });

  describe('use', () => {
    it('heals the team by the computed amount', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const addHp = vi.fn();
      const context = { characters: { addHp } } as unknown as Context;

      new Cure(100, 100).use(context);

      expect(addHp).toHaveBeenCalledWith(100);
    });
  });
});
