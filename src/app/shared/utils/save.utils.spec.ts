import { Save } from '../../models/save';
import { decodeSave, encodeSave } from './save.utils';

const save: Save = {
  characters: {
    list: [
      {
        ref: 'cloud',
        inTeam: true,
        level: 3,
        xp: 12,
        image: 'cloud.png',
        weaponRef: 'buster-sword',
      },
    ],
    hp: 100,
    mp: 20,
    limit: 0,
  },
  zones: {
    list: [{ ref: 'zone1', nbFights: 4, completed: false }],
    level: 1,
    levelMax: 1,
  },
  weapons: [{ ref: 'buster-sword', nbr: 1, equipped: true }],
  materias: [{ ref: 'bolt', ap: 10, level: 1, equipped: true }],
  items: [{ ref: 'potion', nbr: 2, equipped: true }],
  language: 'fr',
  difficulty: 2,
  time: 42,
  gils: 200,
  version: '2.0.0',
} as Save;

const encode = (value: unknown) => btoa(JSON.stringify(value));

describe('save utils', () => {
  it('round trips a save', () => {
    expect(decodeSave(encodeSave(save))).toEqual(save);
  });

  it('ignores surrounding whitespace', () => {
    expect(decodeSave(`  ${encodeSave(save)}\n`)).toEqual(save);
  });

  it('accepts a difficulty stored as a numeric string', () => {
    const old = { ...save, difficulty: '1' };
    expect(decodeSave(encode(old))).toEqual(old);
  });

  it('accepts a weapon without the equipped field', () => {
    const { ref, nbr } = save.weapons[0];
    const without = { ...save, weapons: [{ ref, nbr }] };
    expect(decodeSave(encode(without))).toEqual(without);
  });

  it.each([
    ['empty string', ''],
    ['not base64', 'not base64 JSON'],
    ['not JSON', btoa('{oops')],
    ['null', encode(null)],
    ['an array', encode([save])],
  ])('returns null for %s', (_, encoded) => {
    expect(decodeSave(encoded)).toBeNull();
  });

  // JSON.stringify drops undefined fields: they are missing in the save.
  it.each<[string, unknown]>([
    ['characters', { ...save, characters: undefined }],
    [
      'characters.hp',
      { ...save, characters: { ...save.characters, hp: undefined } },
    ],
    [
      'zones.levelMax',
      { ...save, zones: { ...save.zones, levelMax: undefined } },
    ],
    ['weapons', { ...save, weapons: {} }],
    [
      'a materia ref',
      { ...save, materias: [{ ...save.materias[0], ref: undefined }] },
    ],
    ['an item quantity', { ...save, items: [{ ...save.items[0], nbr: 'x' }] }],
    ['difficulty', { ...save, difficulty: 'hard' }],
    ['gils', { ...save, gils: null }],
    ['version', { ...save, version: undefined }],
  ])('returns null when %s is missing or invalid', (_, broken) => {
    expect(decodeSave(encode(broken))).toBeNull();
  });
});
