import {
  CharacterSave,
  CharactersSave,
  ItemSave,
  MateriaSave,
  Save,
  WeaponSave,
  ZoneSave,
  ZonesSave,
} from '../../models/save';

/**
 * Encode a save as base64 JSON (format of localStorage and exports)
 */
export function encodeSave(save: Save): string {
  return btoa(JSON.stringify(save));
}

/**
 * Decode a base64 JSON save.
 * Returns null if the string is invalid or a required field is missing.
 */
export function decodeSave(encoded: string): Save | null {
  try {
    const value: unknown = JSON.parse(atob(encoded.trim()));
    return isSave(value) ? value : null;
  } catch {
    return null;
  }
}

/** Shape of T before validation: every field may be missing or of any type. */
type Unchecked<T> = { [K in keyof T]?: unknown };

const isObject = <T>(v: unknown): v is Unchecked<T> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

const isString = (v: unknown): v is string => typeof v === 'string';

/** Saves written by the config screen store the difficulty as a string. */
const isNumeric = (v: unknown): boolean =>
  isNumber(v) || (isString(v) && v.trim() !== '' && isNumber(Number(v)));

const isListOf = <T extends { ref: string }>(
  v: unknown,
  fields: (e: Unchecked<T>) => boolean,
): boolean =>
  Array.isArray(v) &&
  v.every((e) => isObject<T>(e) && isString(e.ref) && fields(e));

const isOwned = (e: Unchecked<WeaponSave | ItemSave>): boolean =>
  isNumber(e.nbr) && isBoolean(e.equipped);

function isSave(v: unknown): v is Save {
  if (!isObject<Save>(v)) {
    return false;
  }

  const { characters, zones } = v;
  return (
    isObject<CharactersSave>(characters) &&
    isListOf<CharacterSave>(
      characters.list,
      (c) =>
        isBoolean(c.inTeam) &&
        isNumber(c.level) &&
        isNumber(c.xp) &&
        isString(c.weaponRef),
    ) &&
    isNumber(characters.hp) &&
    isNumber(characters.mp) &&
    isNumber(characters.limit) &&
    isObject<ZonesSave>(zones) &&
    isListOf<ZoneSave>(
      zones.list,
      (z) => isNumber(z.nbFights) && isBoolean(z.completed),
    ) &&
    isNumber(zones.level) &&
    isNumber(zones.levelMax) &&
    isListOf<WeaponSave>(v.weapons, isOwned) &&
    isListOf<MateriaSave>(
      v.materias,
      (m) => isNumber(m.ap) && isNumber(m.level) && isBoolean(m.equipped),
    ) &&
    isListOf<ItemSave>(v.items, isOwned) &&
    isString(v.language) &&
    isNumeric(v.difficulty) &&
    isNumber(v.time) &&
    isNumber(v.gils) &&
    isString(v.version)
  );
}
