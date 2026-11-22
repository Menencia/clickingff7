/**
 * Elements of attacks, weaknesses and resistances.
 */
export const ELEMENTS = [
  'bolt',
  'earth',
  'fire',
  'ice',
  'poison',
  'wind',
] as const;

export type ElementType = (typeof ELEMENTS)[number];
