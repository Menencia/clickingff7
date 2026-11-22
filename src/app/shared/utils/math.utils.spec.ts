import { percent } from './math.utils';

describe('percent', () => {
  it('returns a rounded percentage', () => {
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
    expect(percent(40, 40)).toBe(100);
  });

  it('returns 0 when the maximum is 0', () => {
    expect(percent(0, 0)).toBe(0);
  });
});
