/**
 * Weapon types, in the characters' order (also the shop display order).
 * Each value names an icon in `assets/images/icons/weapons/`.
 */
export const WEAPON_TYPES = [
  'broadsword',
  'gun-arm',
  'knuckle',
  'stave',
  'headdresse',
  'shuriken',
] as const;

export type WeaponType = (typeof WEAPON_TYPES)[number];
