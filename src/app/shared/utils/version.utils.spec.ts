import { isVersionAtLeast } from './version.utils';

describe('isVersionAtLeast', () => {
  it('returns true when versions are equal', () => {
    expect(isVersionAtLeast('1.1.0', '1.1.0')).toBe(true);
  });

  it.each([
    ['2.0.0', '1.1.0'],
    ['1.2.0', '1.1.0'],
    ['1.1.1', '1.1.0'],
  ])('returns true when %s is newer than %s', (v, min) => {
    expect(isVersionAtLeast(v, min)).toBe(true);
  });

  it.each([
    ['0.9.9', '1.1.0'],
    ['1.0.9', '1.1.0'],
    ['1.1.0', '1.1.1'],
  ])('returns false when %s is older than %s', (v, min) => {
    expect(isVersionAtLeast(v, min)).toBe(false);
  });

  it('ignores a pre-release suffix', () => {
    expect(isVersionAtLeast('1.1.0-beta', '1.1.0')).toBe(true);
  });

  it('returns false when a version is not parsable', () => {
    expect(isVersionAtLeast('abc', '1.1.0')).toBe(false);
    expect(isVersionAtLeast('1.1.0', '')).toBe(false);
  });

  it.each([
    ['1.10.0', '1.9.0', true],
    ['1.9.0', '1.10.0', false],
    ['10.0.0', '9.9.9', true],
    ['1.1.10', '1.1.9', true],
    ['1.1.9', '1.1.10', false],
  ])(
    'compares multi-digit numbers numerically (%s >= %s: %s)',
    (v, min, expected) => {
      expect(isVersionAtLeast(v, min)).toBe(expected);
    },
  );

  it('requires literal dots between numbers', () => {
    expect(isVersionAtLeast('1x2x3', '1.0.0')).toBe(false);
    expect(isVersionAtLeast('1-1-0', '1.0.0')).toBe(false);
  });
});
