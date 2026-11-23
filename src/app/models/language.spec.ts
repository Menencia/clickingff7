import { getLanguage, isLanguage, LANGUAGES } from './language';

describe('Language', () => {
  it('lists the supported languages', () => {
    expect(LANGUAGES.map((l) => l.value)).toEqual(['fr', 'en', 'es']);
  });

  it.each([
    ['fr', true],
    ['en', true],
    ['es', true],
    ['de', false],
    ['', false],
    [undefined, false],
  ])('isLanguage(%s) is %s', (value, expected) => {
    expect(isLanguage(value)).toBe(expected);
  });

  it('getLanguage() keeps a supported language', () => {
    expect(getLanguage('es')).toBe('es');
  });

  it('getLanguage() falls back to the default language', () => {
    expect(getLanguage('de')).toBe('en');
    expect(getLanguage(undefined, 'fr')).toBe('fr');
  });
});
