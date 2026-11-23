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

    // Current behaviour on small values: the spread exceeds ±10%
    // (refactors.md n°2 will narrow it).
    it.each([
      { base: 5, draw: 0, hits: 4 },
      { base: 5, draw: 0.999999, hits: 6 },
      { base: 1, draw: 0, hits: 0 },
      { base: 1, draw: 0.999999, hits: 2 },
    ])(
      'returns $hits for $base base hits at draw $draw',
      ({ base, draw, hits }) => {
        vi.spyOn(Math, 'random').mockReturnValue(draw);
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
