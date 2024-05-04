import { compareVersions } from './version.utils';

fdescribe('Version Utils', () => {
  it('should test compareVersions function', () => {
    expect(compareVersions('1.1.0', '1.2.0')).toBe(false);
    expect(compareVersions('1.2.0', '1.2.0')).toBe(true);
    expect(compareVersions('1.3.0', '1.2.0')).toBe(true);
  });
});
