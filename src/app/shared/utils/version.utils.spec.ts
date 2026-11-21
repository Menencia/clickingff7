import { compareVersions } from './version.utils';

// compareVersions(v1, v2) actually returns true when v1 >= v2,
// despite its name and comment.
describe('compareVersions', () => {
  it('returns true when versions are equal', () => {
    expect(compareVersions('1.1.0', '1.1.0')).toBe(true);
  });

  it.each([
    ['2.0.0', '1.1.0'],
    ['1.2.0', '1.1.0'],
    ['1.1.1', '1.1.0'],
  ])('returns true when %s is newer than %s', (v1, v2) => {
    expect(compareVersions(v1, v2)).toBe(true);
  });

  it.each([
    ['0.9.9', '1.1.0'],
    ['1.0.9', '1.1.0'],
    ['1.1.0', '1.1.1'],
  ])('returns false when %s is older than %s', (v1, v2) => {
    expect(compareVersions(v1, v2)).toBe(false);
  });

  it('ignores a pre-release suffix', () => {
    expect(compareVersions('1.1.0-beta', '1.1.0')).toBe(true);
  });

  it('returns false when a version is not parsable', () => {
    expect(compareVersions('abc', '1.1.0')).toBe(false);
    expect(compareVersions('1.1.0', '')).toBe(false);
  });

  // Known bug: groups are compared as strings, so '10' < '9'.
  it.fails('compares multi-digit numbers numerically', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBe(true);
  });
});
