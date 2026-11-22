import { CharacterRef } from './refs/characters';
import { ItemRef } from './refs/items';
import { MateriaRef } from './refs/materias';
import { WeaponRef } from './refs/weapons';

/**
 * What the player gets when a zone is unlocked for the first time
 */
export interface ZoneUnlock {
  /** new characters, at the highest team level, in the team or as backup */
  characters?: { ref: CharacterRef; inTeam: boolean }[];
  /** characters already owned who join the team */
  joinTeam?: CharacterRef[];
  weapons?: WeaponRef[];
  materias?: { ref: MateriaRef; equipped: boolean }[];
  items?: { ref: ItemRef; equipped: boolean }[];
}

/**
 * Unlocks by zone level. Zones that are not listed unlock nothing but the
 * zone itself.
 */
export const ZONE_UNLOCKS: Readonly<Record<number, ZoneUnlock>> = {
  1: {
    characters: [
      { ref: CharacterRef.Cloud, inTeam: true },
      { ref: CharacterRef.Barret, inTeam: true },
    ],
    weapons: [WeaponRef.BusterSword, WeaponRef.GatlingGun],
    materias: [
      { ref: MateriaRef.Restore, equipped: true },
      { ref: MateriaRef.Bolt, equipped: true },
    ],
    items: [
      { ref: ItemRef.Potion, equipped: true },
      { ref: ItemRef.Potion, equipped: true },
    ],
  },
  2: {
    characters: [{ ref: CharacterRef.Tifa, inTeam: true }],
    weapons: [WeaponRef.LeatherGlove],
  },
  3: {
    characters: [{ ref: CharacterRef.Aerith, inTeam: true }],
    weapons: [WeaponRef.GuardStick],
  },
  4: {
    joinTeam: [CharacterRef.Barret, CharacterRef.Tifa],
  },
  5: {
    characters: [{ ref: CharacterRef.RedXIII, inTeam: false }],
    weapons: [WeaponRef.MythrilClip],
  },
  9: {
    characters: [{ ref: CharacterRef.Yuffie, inTeam: false }],
    weapons: [WeaponRef.FPtShuriken],
  },
};
