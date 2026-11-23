import { DIFFICULTIES, Difficulty, isDifficulty } from './difficulty';

describe('Difficulty', () => {
  it('lists every difficulty in increasing order', () => {
    expect(DIFFICULTIES.map((d) => d.value)).toEqual([
      Difficulty.Easy,
      Difficulty.Normal,
      Difficulty.Hard,
    ]);
  });

  it.each([
    [1, true],
    [2, true],
    [3, true],
    [0, false],
    [4, false],
    [Number.NaN, false],
  ])('isDifficulty(%s) is %s', (value, expected) => {
    expect(isDifficulty(value)).toBe(expected);
  });
});
