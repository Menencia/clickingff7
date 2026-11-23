import { isLanguage, LANGUAGES } from './language';

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
});
